
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { convertTime, formatTime, round } from 'convertTime';
import { RadarChart } from "./RadarChart";


export function parse(spans: Timespan[], settings?: any) {

  // ! If you want to edit 'spans' you must clone with Timespan.cloneArray()
  let piechart = settings.radarchart.getSetting();
  
  if (piechart == "Day of week") {
    // DAY OF WEEK

    let data = [
      {axis: "Mon", value: 0},
      {axis: "Tue", value: 0},
      {axis: "Wed", value: 0},
      {axis: "Thu", value: 0},
      {axis: "Fri", value: 0},
      {axis: "Sat", value: 0},
      {axis: "Sun", value: 0}
    ]

    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      let index = settings.centercount.getSetting() ? 
        span.getCenter().getDay()
        : span.start.getDay();

      data[index].value += settings.timescount.getSetting() ?
        1 : span.getLength() / (60*60*1000); // convert to hours;
    }

    return [data];


  } else if (piechart == "Times of day") {
    // TIMES OF DAY
    
    let data = Array.from(new Array(24),(v,i)=>{
      return {axis: i, value: 0}
    });

    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      if (settings.counteachhour.getSetting()) {
        for (let j=span.start.getTime();j<=span.end.getTime();j+=60*60*1000)
          data[(new Date(j)).getHours()].value += 1;
      } else {

        let index = settings.centercount.getSetting() ? 
          span.getCenter().getHours()
          : settings.endcount.getSetting() ? span.end.getDay()
            : span.start.getHours();
        data[index].value += settings.timescount.getSetting() ?
          1 : span.getLength() / (60*60*1000); // convert to hours;
      }
    }

    return [data];


  } else if (piechart == "Months of year") {
    // MONTHS OF YEAR

    var months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    let data = Array.from(new Array(months.length),(v,i)=>{
      return {axis: months[i], value: 0, count: 0 }
    });

    let prevMonth = -1;
    for (let i=0;i<spans.length;i++) {
      let span = spans[i];
      let index = settings.centercount.getSetting() ? 
        span.getCenter().getMonth()
        : span.start.getMonth();

      data[index].value += settings.timescount.getSetting() ?
        1 : span.getLength() / (60*60*1000); // convert to hours;

      if (settings.avgvaluemon.getSetting() && prevMonth != index) {
        data[index].count++;
        prevMonth = index;
      }
    }

    if (settings.avgvaluemon.getSetting())
      for (let i=0;i<data.length;i++)
        data[i].value = data[i].value / data[i].count;

    return [data];
  }

}






export function draw(svg: any, data: any, settings: any, d3: any) {

  if (svg !== null) {
       
    var cfg = {
      w: svg.width.baseVal.value-40,
      h: svg.height.baseVal.value-40,
      margin: {top: 20, right: 20, bottom: 20, left: 20},
      levels: 4,
      opacityArea: 0.45,
      dotRadius: 6,
      opacityCircles: 0.05,
      strokeWidth: 3,
      roundStrokes: settings.smooth.getSetting(),
      color: () => "#26A69A"
    };

    RadarChart(svg, data, cfg, d3);

  }

}
