import { Timespan } from 'app/models/timespan';
import { EventEmitter } from '@angular/core';


export function parse(spans: Timespan[], settings?: any) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()

  let firstYear = spans[0].start.getFullYear();
  let currentYear = firstYear;
  let currentWeek = -1;
  let currentWeekStart = 0;
  let maxTimespansInWeek = 0;

  let data = [];
  for (let i=0;i<spans.length;i++) {
    let span = spans[i];
    if (span.start.getFullYear() != currentYear)
      currentYear++;

    // TODO: if timespan ends in next week it isn't shown in the next week
    let weekIndex = getWeek(span.start) + (currentYear-firstYear)*52 -1;
    if (!data[weekIndex]) {
      currentWeekStart = getMonday(span.start).getTime();
      data[weekIndex] = [
        span.start.getFullYear()+"-"+getWeek(span.start),
        new Timespan(-1, new Date(currentWeekStart), span.start)
      ];
    }

    if (data[weekIndex].length > 2)
      data[weekIndex].push( new Timespan(-1,data[weekIndex][data[weekIndex].length-1].end, span.start ) );

    data[weekIndex].push( span );

    if (maxTimespansInWeek < data[weekIndex].length-1)
      maxTimespansInWeek = data[weekIndex].length-1;

  }

  // fill all weeks to same amount of spans
  let emptydate = new Date(0);
  let emptyspan = new Timespan(-1, emptydate, emptydate);
  for (let i=0;i<data.length;i++)
    while (data[i].length <= maxTimespansInWeek)
      data[i].push(emptyspan);

  return data;

}





export function draw(svg: any, data: any, d3: any, onSpanClick: EventEmitter<string>) {

  // TODO: rotate all axis

  let padding = 35;
  let barWidth = 20;

  if (svg !== null) {

    let series = d3.stack()
      .keys( Array(data[0].length).fill(0).map((x,i) => x=i) )
      .offset(d3.stackOffsetNone)(data);

    let graph = d3.select(svg),
        width = svg.width.baseVal.value,
        height = svg.height.baseVal.value;

    graph.text('');

    let domains = [];
    let x = d3.scaleBand()
        .domain(data.map((d) => {domains.push(d[0]); return d[0]}))
        .range([padding, width - padding])
        .padding(0.3);

    let y = d3.scaleTime()
      .domain([0, 1000*60*60*24*8]) // week
      .range([0,height-padding*2]);

    let colors = ["transparent","black"];

    graph.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
        .attr("class", "group")
        .attr("transform", "translate(0,"+ padding +")")
      .selectAll("rect")
      .data((d,i) => { 
        return d.map((e) => e.data[i]);
      })
      .enter().append("rect")
        .attr("width", x.bandwidth)
        .attr("x", (d,i) => x(domains[i]))
        .attr("class", (d,i) => {
          if (!(d instanceof Timespan) || d.line < 0) return colors[0];
          return colors[1];
        })
        .attr("fill", (d,i) => {
          if (!(d instanceof Timespan) || d.line < 0) return colors[0];
          return colors[1];
        })
        .attr("y", (d,i) => {
          if (!(d instanceof Timespan)) return 0;
          let mon = getMonday(d.start);
          console.log(mon);
          return y(d.start.getTime() - mon.getTime());
        })
        .attr("height", (d,i) => {
          if (!(d instanceof Timespan)) return 0;
          return y(d.getLength());
        })
        .on("click", (d) => {
          if (d instanceof Timespan && d.line > -1)
            onSpanClick.emit(d.line.toString())
        })
        .append("title")
          .text((d) => {
            if (d instanceof Timespan) {
              return d.printShort()+ " = "+d.printLength();
            } else {
              return "";
            }
          });

    graph.append("g")
      .attr("class","axis x")
      .attr("transform", "translate(0," + (height-padding) + ")")
      .call(
        d3.axisBottom(x)
      );

    graph.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + padding + ","+ padding +")")
      .call(
        d3.axisLeft(y)
          .ticks(9)
          .tickSize(-width+2*padding)
          .tickFormat((d,i) => ["Tue","Wed","Thu","Fri","Sat","Sun","Mon"][i%7] )
      )
      .append("text")
        .attr("x", "-3")
        .attr("y", y(y.domain()[0]) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .text("Mon");

  }

}




// Source: https://weeknumber.net/how-to/javascript
function getWeek(input: Date): number {
  var date = new Date(input.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

function getMonday(d: Date): Date {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  let mon = new Date(d.setDate(diff));
  mon.setHours(0);
  mon.setMinutes(0);
  mon.setSeconds(0);
  return mon;
}
