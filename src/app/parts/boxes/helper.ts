
import { Timespan } from 'app/models/timespan';
import { EventEmitter } from '@angular/core';
import * as _d3Tip from "d3-tip";


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


    if (settings.split.getSetting() && getWeek(span.end) != getWeek(span.start)) {
      let nextWeekIndex = getWeek(span.end) + (currentYear-firstYear)*52 -1;
      data[weekIndex].push(new Timespan(span.line,span.start, new Date(currentWeekStart+1000*60*60*24*7-1) ));
      currentWeekStart = getMonday(span.end).getTime();
      data[nextWeekIndex] = [
        span.end.getFullYear()+"-"+getWeek(span.end),
        new Timespan(span.line, new Date(getMonday(span.end).getTime()), span.end)
      ];
    } else {
      data[weekIndex].push(span);
    }

    if (maxTimespansInWeek < data[weekIndex].length-1)
      maxTimespansInWeek = data[weekIndex].length-1;

  }

  // clean prepended empty array elements
  while(data[0] == undefined)
    data.shift();

  // fill all weeks to same amount of spans
  let emptydate = new Date(0);
  let emptyspan = new Timespan(-1, emptydate, emptydate);
  for (let i=0;i<data.length;i++) {
    if (!data[i])
      data[i] = [];
    while (data[i].length <= maxTimespansInWeek)
      data[i].push(emptyspan);

  }

  return data;

}






export function draw(svg: any, data: any, settings:any, d3: any, onSpanClick: EventEmitter<string>) {

  let padding = 50;
  let rowHeight = 25;
  const d3Tip = _d3Tip.bind(d3);

  if (svg !== null) {

    let series = d3.stack()
      .keys( Array(data[0].length).fill(0).map((e,i) => e=i) )
      .offset(d3.stackOffsetNone)(data);

    let tip = d3Tip().attr('class', 'd3-tip').html((d) => {
      if (d instanceof Timespan) {
        let string = d.printShort()+" = "+d.printLength();
        if (d.line > -1)
          return string;
        return "<span style='opacity:0.65'>("+string+")</span>";
      }
      return "";
    });

    let graph = d3.select(svg),
        width = svg.width.baseVal.value,
        height = padding*2+rowHeight*data.length;

    let x = d3.scaleTime()
      .domain([0, 1000*60*60*24*(7+(settings.split.getSetting() ? 0 : 1))]) // week
      .range([0,width-padding*2]);
      
    let domains = [];
    let y = d3.scaleBand()
        .domain(data.map((d) => {domains.push(d[0]); return d[0]}))
        .range([padding, height - padding])
        .padding(0.35);

    let colors = ["transparent","black"];

    graph
      .text('')
      .attr("height",height)
      .call(tip)
      .append("g")
        .selectAll("g")
        .data(series)
        .enter().append("g")
          .attr("class", "group")
          .attr("transform", "translate("+ padding +",0)")
        .selectAll("rect")
        .data((d,i) => { 
          return d.map((e) => e.data[i]);
        })
        .enter().append("rect")
          .attr("height", y.bandwidth)
          .attr("y", (d,i) => y(domains[i]))
          .attr("class", (d,i) => {
            if (!(d instanceof Timespan) || d.line < 0) return colors[0];
            return colors[1];
          })
          .attr("fill", (d,i) => {
            if (!(d instanceof Timespan) || d.line < 0) return colors[0];
            return colors[1];
          })
          .attr("x", (d,i) => {
            if (!(d instanceof Timespan)) return 0;
            return x(d.start.getTime() - getMonday(d.start).getTime());
          })
          .attr("width", (d,i) => {
            if (!(d instanceof Timespan)) return 0;
            return x(d.getLength());
          })
          .on("click", (d) => {
            if (d instanceof Timespan && d.line > -1)
              onSpanClick.emit(d.line.toString())
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
          

    graph.append("g")
      .attr("class","axis x")
      .attr("transform", "translate(" + (padding+4) + ","+ padding +")")
      .call(
        d3.axisTop(x)
        .ticks(14)
        .tickSize(-height+2*padding+2)
        .tickFormat((d,i) => {
          if (!(i%2)) return "";
          return ["Tue","Wed","Thu","Fri","Sat","Sun","Mon"][Math.floor(i/2)]
        })
        .tickSizeOuter(0)
      );

    graph.append("g")
      .attr("class","axis y")
      .attr("transform", "translate(" + padding + ","+ 0 +")")
      .call(
        d3.axisLeft(y)
      ).append("text")
        .attr("x", x(x.domain()[0]))
        .attr("y", padding - 6)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("text-anchor", "middle")
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
  mon.setMilliseconds(0);
  return mon;
}
