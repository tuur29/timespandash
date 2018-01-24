
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'convertTime';

export function parse(spans: Timespan[], settings?: any) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let data = [];
  for (let i=0;i<spans.length;i++) {
    let span = spans[i];
    let date = new Date(span.getCenter().toISOString().substring(0, 10));

    if (data.length < 1 || data[data.length-1].date.getTime() != date.getTime())
      data.push({date: date, value: 0});

    data[data.length-1].value += settings.timescount.getSetting() ?
      1 : span.getLength() / (60*1000); // convert to minutes

  }

  if (settings.avg.getSetting()) {
    let tmpData = [];
    for (let i=0;i<data.length;i++) {
      if (!tmpData[Math.floor(i/settings.avg.getSetting())])
        tmpData[Math.floor(i/settings.avg.getSetting())] = {date: data[i].date, value: 0};
      tmpData[Math.floor(i/settings.avg.getSetting())].value +=  data[i].value;
    }
    data = tmpData;
  }  

  if (settings.cumulative.getSetting()) {
    let total = 0;
    for (let i in data) {
      total += data[i].value;
      data[i].value = total;
    }
  }

  return data;

}







export function draw(svg: any, data: any, d3: any, settings: any) {

  let padding: number = 35;
  let curves = {
    curveLinear: d3.curveLinear,
    curveStep: d3.curveStep,
    curveBasis: d3.curveBasis,
    curveCardinal: d3.curveCardinal,
    curveMonotoneX: d3.curveMonotoneX,
    curveCatmullRom: d3.curveCatmullRom
  }

  if (svg !== null) {
    let width: number = svg.width.baseVal.value;
    let height: number = svg.height.baseVal.value;

    let x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    let y = d3.scaleLinear()
      .domain(d3.extent(data, (d) => d.value))
      .range([height-2*padding/3, 0]);

    let curve = d3.curveBasis;
    if (settings.curve.getSetting())
      curve = curves[settings.curve.getSetting()];

    let line = d3.line()
      .curve(curve)
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    var zoom = d3.zoom()
      .scaleExtent([0.5, 7.5])
      .translateExtent([[-width*0.75, -height*0.75], [width*1.75 , height*1.75]])
      .on("zoom", () => {
        graph.select(".trendline").attr("transform", d3.event.transform);
        graph.select(".line").attr("transform", d3.event.transform);
        graph.select(".x.axis").call(xAxis.scale(d3.event.transform.rescaleX(x)));
        graph.select(".y.axis").call(yAxis.scale(d3.event.transform.rescaleY(y)));
      });

    let graph = d3.select(svg)
      .text('')
      .call(zoom);

    let multiFormat = function(date) {
      return (d3.timeSecond(date) < date ? d3.timeFormat(".%L")
          : d3.timeMinute(date) < date ? d3.timeFormat(":%S")
          : d3.timeHour(date) < date ? d3.timeFormat("%H:%M")
          : d3.timeDay(date) < date ? d3.timeFormat("%H:00")
          : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? 
              d3.timeFormat("%m-%d") : d3.timeFormat("%m-%d"))
          : d3.timeYear(date) < date ? d3.timeFormat("%b")
          : d3.timeFormat("%Y"))(date);
    }

    let xAxis = d3.axisBottom(x)
      .ticks(20)
      .tickSize(height-2*padding/3)
      .tickPadding(10)
      .tickFormat(multiFormat);

    let yAxis = d3.axisLeft(y)
      .ticks(10)
      .tickSize(width-padding)
      
    graph.append("svg:clipPath")
      .attr("id", "clipline")
      .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height-2*padding/3);

    graph.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate("+padding+", "+0+")")
      .call(xAxis);

    graph.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+width+", 0)")
      .call(yAxis);

    let chartBody = graph.append("g")
      .attr("width", width-padding)
      .attr("height", height-2*padding)
      .attr("transform", "translate("+padding+", 0)")
      .attr("clip-path", "url(#clipline)");

    chartBody.append("svg:path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill","none")
      .attr("stroke","black");

    // Trendline

    // get the x and y values for least squares
    let xLabels = data.map((d) => d.date);
    let xSeries = d3.range(1, xLabels.length + 1);
    let ySeries = data.map((d) =>parseFloat(d.value));
    
    let leastSquaresCoeff = leastSquares(xSeries, ySeries);
    
    // apply the reults of the least squares regression
    let x1 = xLabels[0];
    let y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    let x2 = xLabels[xLabels.length - 1];
    let y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
    let trendData = [[x1,y1,x2,y2]];
    let trendline = chartBody.selectAll(".trendline").data(trendData);
      
    trendline.enter().append("line")
      .attr("class", "trendline")
      .attr("x1",(d) => x(d[0]))
      .attr("y1",(d) => y(d[1]))
      .attr("x2",(d) => x(d[2]))
      .attr("y2",(d) => y(d[3]))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

      zoom.scaleTo(graph, 0.9);
      zoom.translateTo(graph,width/2+padding/2,height/2-padding/2);
  }

  function leastSquares(xSeries, ySeries) {
    let reduceSumFunc = (prev, cur) => prev + cur;
    
    let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;
    let ssXX = xSeries.map((d) => Math.pow(d - xBar, 2))
      .reduce(reduceSumFunc);
    
    let ssYY = ySeries.map((d) => Math.pow(d - yBar, 2))
      .reduce(reduceSumFunc);
      
    let ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar))
      .reduce(reduceSumFunc);
      
    let slope = ssXY / ssXX;
    let intercept = yBar - (xBar * slope);
    let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    
    return [slope, intercept, rSquare];
  }

}

