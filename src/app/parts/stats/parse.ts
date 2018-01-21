
import { Timespan } from 'app/models/timespan';
import { Stat } from './stats.component';
import { convertTime, formatTime, round } from 'convertTime';


function calcMedian(arr) {
  arr = arr.sort( function(a, b){ return a - b });
  return arr[ Math.floor( arr.length/2 ) ];
}

export function parse(spans: Timespan[], stats: Stat[]) {

  let currentTimesPerDay = 0;
  let currentLengthPerDay = 0;

  // stat 1
  stats[1].value = spans.length;

  for (let i=0;i<spans.length;i++){
    let span = spans[i];

    // stat 11 & 12
    stats[11].value.push(span.start);
    stats[12].value.push(span.end);

    // stat 3
    stats[3].value += span.getLength();

    // stat 4
    if (stats[4].value < span.getLength()){
      stats[4].value = span.getLength();
      stats[4].timespan = span;
    }

    // stat 5
    else if (stats[5].value > span.getLength()){
      stats[5].value = span.getLength();
      stats[5].timespan = span;
    }

    if (i > 0) {

      // new day
      if (spans[i-1].start.toDateString() != span.start.toDateString()) {
        currentTimesPerDay = 1;
        currentLengthPerDay = span.getLength();

        // stat 2
        stats[2].value += 1;
        
      } else {
        currentTimesPerDay++;
        currentLengthPerDay += span.getLength();
      }

      // stat 0
      if (currentTimesPerDay > stats[0].value) {
        stats[0].value = currentTimesPerDay;
        stats[0].timespan = span;
      }

      // stat 13
      if (currentLengthPerDay > stats[13].value) {
        stats[13].value = currentLengthPerDay;
        stats[13].timespan = span;
      }

      let temp6 = new Timespan(0, spans[i-1].end, span.start)
      let temp7 = new Timespan(0, spans[i-1].end, span.start)

      // stat 6
      if (stats[6].value < temp6.getLength()) {
        stats[6].value = temp6.getLength();
        stats[6].timespan = span;
      }

      // stat 7
      else if (stats[7].value > temp7.getLength()) {
        stats[7].value = temp7.getLength();
        stats[7].timespan = span;
      }

    } else {
      stats[2].value += 1;
    }
  }

  // stat 8
  stats[8].value = round(stats[1].value / stats[2].value);

  // stat 9
  stats[9].value = stats[3].value / stats[2].value;

  // stat 10
  stats[10].value = round(100*stats[9].value / (24*60*60*1000)) + "%";

  // stat 11 & 12
  stats[11].value = formatTime(calcMedian(stats[11].value));
  stats[12].value = formatTime(calcMedian(stats[12].value));


  // convert time to human readable for some stats
  for (let i of [3,4,5,6,7,9,13])
    stats[i].value = convertTime(stats[i].value);
}
