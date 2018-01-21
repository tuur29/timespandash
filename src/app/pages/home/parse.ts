
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';


export function parse(timespans: Timespan[], settings: any): Timespan[] {

  for (let i=0;i<timespans.length;i++){
    let span = timespans[i];

    // set 0
    if (i > 0 && settings.mergebreaks.getSetting()) {
      let temp0 = new Timespan(0, timespans[i-1].end, span.start);
      if (temp0.getLength() < parseInt(settings.mergebreaks.getSetting())*60*1000) {
        timespans[i-1].end = span.end;
        timespans.splice(i,1);
        i--;
        continue;
      } 
    }

    // set 1
    if (settings.remshortenthan.getSetting()
      && span.getLength() < parseInt(settings.remshortenthan.getSetting())*60*1000) {
      timespans.splice(i,1);
      i--;
      continue;
    }

    // set 3
    if (settings.ignbeforedate.getSetting() ){
      let temp3 = new Date(settings.ignbeforedate.getSetting());
      if (temp3.getTime() > 1 && span.start < temp3) {
        timespans.splice(i,1);
        i--;
        continue;
      }
    }

    // set 4
    if (settings.ignafterdate.getSetting() ){
      let temp4 = new Date(settings.ignafterdate.getSetting());
      if (temp4.getTime() > 1 && span.start > temp4) {
        timespans.splice(i,1);
        i--;
        continue;
      }
    }    

  }

  return timespans;
}
