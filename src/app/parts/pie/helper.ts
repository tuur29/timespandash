
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round, getAbsoluteTimeUnit } from 'src/convertTime';
import * as _d3Tip from "d3-tip";


export function parse(spans: Timespan[], settings?: Record<string, Setting>) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let color = "#26A69A";
  let piechart = settings.piechart.getSetting();
  
  if (piechart == "Day of week") {
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
        1 : span.getLength() /getAbsoluteTimeUnit(settings.timeunit.getSetting());
    }

    return data;


  } else if (piechart == "Times of day") {
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
          : settings.endcount.getSetting() ? span.end.getDay()
            : span.start.getHours();
        data[index].yVal += settings.timescount.getSetting() ?
          1 : span.getLength() / getAbsoluteTimeUnit(settings.timeunit.getSetting());
      }
    }

    return data;


  } else if (piechart == "Months of year") {
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
        1 : span.getLength() / getAbsoluteTimeUnit(settings.timeunit.getSetting());

      if (settings.avgvaluemon.getSetting() && prevMonth != index) {
        data[index].count++;
        prevMonth = index;
      }
    }

    if (settings.avgvaluemon.getSetting())
      for (let i=0;i<data.length;i++)
        data[i].yVal = data[i].yVal / data[i].count;

    return data;
  }

}






export function draw(svg: any, data: any, settings: any, d3: any) {

  let padding: number = 35;
  const d3Tip = _d3Tip.bind(d3);
  const total = data.reduce((a, c) => a += parseInt(c.yVal), 0);

  if (svg !== null) {
    let width: number = svg.width.baseVal.value;
    let height: number = svg.height.baseVal.value;

    let tip = d3Tip().attr('class', 'd3-tip').html((d) => settings.percentages.getSetting()
      ? round(d.data.yVal / total*100) + "%"
      : round(d.data.yVal));

    let graph = d3.select(svg)
      .text('')
      .call(tip);

    let radius = Math.min(width, height) / 2,
        g = graph.append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleLinear().domain([1,data.length])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#ff0000"), d3.rgb('#0000ff')]);

    var pie = d3.pie()
        .sort(null)
        .value((d) => d.yVal);

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(15)
        .cornerRadius(4)
        .padAngle(.06);

    var label = d3.arc()
        .outerRadius(radius - 60)
        .innerRadius(radius - 40);

    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", (d,i) => color(i))
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    arc.append("text")
        .attr("transform", (d) => "translate(" + label.centroid(d) + ")")
        .attr("dy", "0.35em")
        .attr("fill", "#eee")
        .text((d) => d.data.name);

   }

}
