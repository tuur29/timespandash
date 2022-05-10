
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'src/convertTime';


export function parse(spans: Timespan[], settings?: Record<string, Setting>) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let data = [];
  for (let i=0;i<spans.length;i++) {
    let span = spans[i];
    let date = new Date(
      ( settings.endcount.getSetting() ? span.end : span.start )
      .toISOString().substring(0, 10)
    );

    if (data.length < 1 || data[data.length-1].date.getTime() != date.getTime())
      data.push({date: date, values: []});

    data[data.length-1].values.push( settings.endcount.getSetting() ?
      normalize(span.end).getTime() : normalize(span.start).getTime()
    );
  }

  // grouping
  let tmpData = [];
  if (settings.avg.getSetting()) {
    for (let i=0;i<data.length;i++) {
      let key = Math.floor(i/settings.avg.getSetting());
      if (!tmpData[key])
        tmpData[key] = {date: data[i].date, value: 0, values: []};
      tmpData[key].values = tmpData[key].values.concat(data[i].values);
    }
    data = tmpData;
  }

  // calc averages / median
  for (let i=0;i<data.length;i++) {
    if (settings.median.getSetting())
      data[i].value = data[i].values[ Math.floor(data[i].values.length/2) ];
    else
      data[i].value = data[i].values.reduce(((x,y) => x+y),0) / data[i].values.length;
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

    let y = d3.scaleTime()
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
      .scaleExtent([0.5, 15])
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

    let xAxis = d3.axisBottom(x)
      .ticks(20)
      .tickSize(height-2*padding/3)
      .tickPadding(10)
      .tickFormat((d) => d3.timeHour(d).getHours()<1 ? d3.timeFormat("%m-%d")(d) : "");

    let yAxis = d3.axisLeft(y)
      .ticks(10)
      .tickSize(width-padding)
      .tickFormat(d3.timeFormat("%H:%M"));
      
    graph.append("svg:clipPath")
      .attr("id", "cliptodevo")
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
      .attr("clip-path", "url(#cliptodevo)");

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

function normalize(d: Date): Date {
  let date = new Date(0); // jan 1 1970
  date.setHours(d.getHours());
  date.setMinutes(d.getMinutes());
  date.setSeconds(d.getSeconds());
  if (d.getHours() <= 12) date.setDate(2);
  return date;
}
