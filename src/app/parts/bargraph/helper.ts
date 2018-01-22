
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'convertTime';

export function parse(spans: Timespan[], settings?: any) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let color = "#26A69A";
  let bargraph = settings.bargraph.getSetting();
  
  if (bargraph == "Day of week") {
    // DAY OF WEEK

    let data = [
      {name: "Mon", yVal: 0, color: color},
      {name: "Tue", yVal: 0, color: color},
      {name: "Wed", yVal: 0, color: color},
      {name: "Thu", yVal: 0, color: color},
      {name: "Fri", yVal: 0, color: color},
      {name: "Sat", yVal: 0, color: color},
      {name: "Sun", yVal: 0, color: color}
    ]

    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      let index = settings.centercount.getSetting() ? 
        span.getCenter().getDay()
        : span.start.getDay();

      data[index].yVal += settings.timescount.getSetting() ?
        1 : span.getLength() / (60*60*1000); // convert to hours;
    }

    return data;


  } else if (bargraph == "Times of day") {
    // TIMES OF DAY
    
    let data = Array.from(new Array(24),(v,i)=>{
      return {name: i, yVal: 0, color: color}
    });

    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      if (settings.counteachhour.getSetting()) {
        for (let j=span.start.getTime();j<=span.end.getTime();j+=60*60*1000)
          data[(new Date(j)).getHours()].yVal += 1;
      } else {

        let index = settings.centercount.getSetting() ? 
          span.getCenter().getHours()
          : span.start.getHours();
        data[index].yVal += settings.timescount.getSetting() ?
          1 : span.getLength() / (60*60*1000); // convert to hours;
      }
    }

    return data;


  } else if (bargraph == "Months of year") {
    // MONTHS OF YEAR

    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let data = Array.from(new Array(months.length),(v,i)=>{
      return {name: months[i], yVal: 0, color: color, count: 0 }
    });

    let prevMonth = -1;
    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      let index = settings.centercount.getSetting() ? 
        span.getCenter().getMonth()
        : span.start.getMonth();

      data[index].yVal += settings.timescount.getSetting() ?
        1 : span.getLength() / (60*60*1000); // convert to hours;

      if (settings.avgvaluemon.getSetting() && prevMonth != index) {
        data[index].count++;
        prevMonth = index;
      }
    }

    if (settings.avgvaluemon.getSetting())
      for (let i=0;i<data.length;i++)
        data[i].yVal = data[i].yVal / data[i].count;
    
    return data;
    

  } else if (bargraph == "Years") {
    // YEARS
    let firstyear = spans[spans.length-1].start.getFullYear();
    let lastyear = spans[0].end.getFullYear();
    let data = Array.from(new Array(lastyear-firstyear+1),(v,i)=>{
      return {name: i+firstyear, yVal: 0, color: color, count: 0 }
    });

    let prevMonth = -1;
    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      let index = settings.centercount.getSetting() ? 
        span.getCenter().getFullYear()
        : span.start.getFullYear();

      data[index-firstyear].yVal += settings.timescount.getSetting() ?
        1 : span.getLength() / (60*60*1000); // convert to hours;

      if (settings.avgvaluemon.getSetting()) {
        let month = settings.centercount.getSetting() ? 
          span.getCenter().getMonth()
          : span.start.getMonth();
        if (prevMonth != month) {
          data[index-firstyear].count++;
          prevMonth = month;
        }
      }
    }

    console.log(data);

    if (settings.avgvaluemon.getSetting())
      for (let i=0;i<data.length;i++)
        data[i].yVal = data[i].yVal / data[i].count;

    return data;

  }

}






export function draw(svg: any, data: any, d3: any) {

  let padding: number = 35;
  let width: number = svg.width.baseVal.value;
  let height: number = svg.height.baseVal.value;

  if (svg !== null) {

    let graph = d3.select(svg);
    graph.text('');

    let xScale = d3.scaleBand()
      .domain(data.map((d) => d.name ))
      .range([0, width-padding*1.5]);

    let yScale = d3.scaleLinear()
      .domain([0,d3.max(data, (d) => d.yVal)])
      .range([height-padding*2, 0]);

    let xAxis = d3.axisBottom(xScale)
      .ticks(data.length)
      .scale(xScale);

    let yAxis = d3.axisLeft(xScale)
      .scale(yScale)
      .ticks(7,"s");

    graph.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + "," + padding + ")")
      .call(yAxis);

     graph.append('g')
       .attr('class', 'axis')
       .attr("transform", "translate(" + padding + "," + (height - padding) + ")")
       .call(xAxis);

    let rects = graph.selectAll('rect')
      .data(data);
    rects.size();

    let newRects = rects.enter();
    let rectWidth = ( (width-padding*1.5)/(data.length*1.5) );
    newRects.append('rect')
      .attr('x', (d,i) => xScale(d.name))
      .attr('y', (d) => yScale(d.yVal))
      .attr('height', (d) =>
        height - yScale(d.yVal) - (2*padding) + 5)
      .attr('width', rectWidth )
      .attr('fill', (d, i) => data[i].color)
      .attr("transform","translate(" 
        + (padding + rectWidth/4 ) + "," + (padding - 5) + ")")
      .append('svg:title')
        .text((d) => d.name + ": " + round(d.yVal) + " hours");


    // Trendline

    // get the x and y values for least squares
    let xLabels = data.map((d) => d.name);
    let xSeries = d3.range(1, xLabels.length + 1);
    let ySeries = data.map((d) =>parseFloat(d.yVal));
    
    let leastSquaresCoeff = leastSquares(xSeries, ySeries);
    
    // apply the reults of the least squares regression
    let x1 = xLabels[0];
    let y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
    let x2 = xLabels[xLabels.length - 1];
    let y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
    let trendData = [[x1,y1,x2,y2]];
    let trendline = graph.selectAll(".trendline").data(trendData);
      
    trendline.enter()
      .append("line")
      .attr("class", "trendline")
      .attr("x1",(d) => xScale(d[0]))
      .attr("y1",(d) => yScale(d[1]))
      .attr("x2",(d) => xScale(d[2]))
      .attr("y2",(d) => yScale(d[3]))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("transform","translate(" 
        + (padding + 2*rectWidth/3 ) + "," + padding + ")");
    
    // // display equation on the chart
    // graph.append("text")
    //   .text("eq: " + round(leastSquaresCoeff[0])
    //     + "x + " + round(leastSquaresCoeff[1]))
    //   .attr("fill", "black")
    //   .attr("class", "text-label")
    //   .attr("x", (d) => xScale(x2)-60 )
    //   .attr("y", (d) => yScale(y2)-30 )
    //   .attr("transform","translate(" 
    //     + (padding ) + "," + (padding - 5) + ")");
    
    // // display r-square on the chart
    // graph.append("text")
    //   .text("r-sq: " + round(leastSquaresCoeff[2]))
    //   .attr("fill", "black")
    //   .attr("class", "text-label")
    //   .attr("x", (d) => xScale(x2)-60 )
    //   .attr("y", (d) => yScale(y2)-10 )
    //   .attr("transform","translate(" 
    //     + (padding ) + "," + (padding - 5) + ")");

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
