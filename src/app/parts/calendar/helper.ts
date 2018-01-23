
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'convertTime';
import { EventEmitter } from '@angular/core';
import * as _d3Tip from "d3-tip";


export function parse(spans: Timespan[], settings?: any) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let data = [];
  for (let i=0;i<spans.length;i++) {
    let span = spans[i];
    let date = new Date( settings.centercount.getSetting() ? span.getCenter().toISOString()
      : settings.endcount.getSetting() ? span.end.toISOString()
        : span.start.toISOString() );
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    let index = date.getTime();
    if (!data[index])
      data[index] = {date: date, value: 0};

    data[index].value += settings.timescount.getSetting() ?
      1 : span.getLength() / (60*60*1000); // convert to hours

  }

  return data;

}







export function draw(svg: any, data: any, d3: any, onDayClick: EventEmitter<string>) {
  
  let padding: number = 25;
  const d3Tip = _d3Tip.bind(d3);

  if (svg !== null) {

    let firstYear = first(data).date.getFullYear();
    let lastYear = last(data).date.getFullYear() +1;

    let width: number = svg.width.baseVal.value;
    let cellSize = (width - padding*2) / (53 + 2); // 2 cells padding for year
    let yearHeight = cellSize*9; // one cell padding
    let height = yearHeight*(lastYear-firstYear)+padding*2;

    let format = d3.timeFormat("%Y-%m-%d");
    let tip = d3Tip().attr('class', 'd3-tip').html((d) => {
      let index = new Date(d);
      index.setHours(0);
      index.setMinutes(0);
      index.setSeconds(0);
      return d + ( data[index.getTime()] ?
         ": "+round(data[index.getTime()].value)
         : ""
       )
    });

    var min = 0;
    var max = 0;
    for (var i in data) {
      if (max < data[i].value)
        max = data[i].value;
      else if (min > data[i].value)
        min = data[i].value;
    }

    var color = d3.scaleLinear().domain([Math.floor(min),Math.ceil(max)])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#ff0000"), d3.rgb('#0000ff')]);

    let graph = d3.select(svg)
      .call(tip)
      .attr('height', height)
      .text('');

    let year = graph.selectAll(".year")
      .data(d3.range(firstYear, lastYear))
      .enter()
        .append("g")
        .attr("class", "year")
        .attr("transform", (d,i) => 
          "translate(" + (4*padding/3) + "," + (padding+yearHeight*i) + ")");

    year.append("text")
      .attr("transform", "translate(-10," + cellSize * 3.5 + ")rotate(-90)")
      .style("text-anchor", "middle")
      .text((d) => d);

    let rect = year.selectAll(".day")
      .data((d) => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter().append("rect")
      .attr("class", "day")
      .attr("fill", (d) => data[d.getTime()] ? color(data[d.getTime()].value) : "none")
      .attr("stroke", "#444")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", (d) => d3.timeWeek.count(d3.timeYear(d), d) * cellSize)
      .attr("y", (d) => d.getDay() * cellSize)
      .datum(format)
      .on("click", (d) => { onDayClick.emit(d) })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
      
    year.selectAll(".month")
      .data((d) => d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "2.5")
      .attr("class", "month")
      .attr("d", (d) => monthPath(d, cellSize));

  }

  function monthPath(t0: Date, cellSize: number) {
    let t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(),
        w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
      "H" + w0 * cellSize + "V" + 7 * cellSize +
      "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
      "H" + (w1 + 1) * cellSize + "V" + 0 +
      "H" + (w0 + 1) * cellSize + "Z";
  }

}

function first(array: any[]) {
  return array[Object.keys(array)[0]];
}

function last(array: any[]) {
  let keys = Object.keys(array);
  return array[keys[keys.length-1]];
}
