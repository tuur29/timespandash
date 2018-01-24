
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';


let timezones = [
  ["CET","GMT+0100"],
  ["CEST","GMT+0200"]
];

export function parse(data: string, settings: any) : Timespan[] {

  let useLastOccurenceOfKeywordAsEnd = settings.lastocc.getSetting();

  let keyword = "",
      lines = data.split("\n"),
      timestamps = [],
      timespans = [];

  // parse lines and take each alternate keyword
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^\S*$/))
      continue;

    let line: any[] = lines[i].split(" at ");

    line[0] = line[0].replace(/\s/g,'');
    if (keyword != line[0]) {
      if ( useLastOccurenceOfKeywordAsEnd && i < lines.length-1
        && lines[i+1].toString().indexOf(line[0]) > -1 ){
        continue;
      }

      for (let zone of timezones)
        line[1] = line[1].replace(zone[0],zone[1]);

      line[1] = new Date(line[1]);
      keyword = line[0];
      timestamps.push(line);
    }
  }

  // make timespan
  let j = 0;
  for (let i = 1; i < timestamps.length; i=i+2) {
    let x = new Timespan(j++, timestamps[i-1][1], timestamps[i][1]);
    timespans.push( x );
  }

  return timespans;
}
