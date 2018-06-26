
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';

let timezones = [
  ["ACDT", "GMT+10:30"],
  ["ACST", "GMT+9:30"],
  ["ADT", "GMT−3"],
  ["AEDT", "GMT+11"],
  ["AEST", "GMT+10"],
  ["AFT", "GMT+4:30"],
  ["AKDT", "GMT−8"],
  ["AKST", "GMT−9"],
  ["AMST", "GMT+5"],
  ["AMT", "GMT+4"],
  ["ART", "GMT−3"],
  ["AST", "GMT+3"],
  ["AST", "GMT+4"],
  ["AST", "GMT+3"],
  ["AST", "GMT−4"],
  ["AWDT", "GMT+9"],
  ["AWST", "GMT+8"],
  ["AZOST", "GMT−1"],
  ["AZT", "GMT+4"],
  ["BDT", "GMT+8"],
  ["BIOT", "GMT+6"],
  ["BIT", "GMT−12"],
  ["BOT", "GMT−4"],
  ["BRT", "GMT−3"],
  ["BST", "GMT+6"],
  ["BST", "GMT+1"],
  ["BTT", "GMT+6"],
  ["CAT", "GMT+2"],
  ["CCT", "GMT+6:30"],
  ["CDT", "GMT−5"],
  ["CEDT", "GMT+2"],
  ["CEST", "GMT+0200"],
  ["CET", "GMT+0100"],
  ["CHADT", "GMT+13:45"],
  ["CHAST", "GMT+12:45"],
  ["CIST", "GMT−8"],
  ["CKT", "GMT−10"],
  ["CLST", "GMT−3"],
  ["CLT", "GMT−4"],
  ["COST", "GMT−4"],
  ["COT", "GMT−5"],
  ["CST", "GMT−6"],
  ["CST", "GMT+8"],
  ["CST", "GMT+9:30"],
  ["CT", "GMT+8"],
  ["CVT", "GMT−1"],
  ["CXT", "GMT+7"],
  ["CHST", "GMT+10"],
  ["DFT", "GMT+1"],
  ["EAST", "GMT−6"],
  ["EAT", "GMT+3"],
  ["ECT", "GMT−4"],
  ["ECT", "GMT−5"],
  ["EDT", "GMT−4"],
  ["EEDT", "GMT+3"],
  ["EEST", "GMT+3"],
  ["EET", "GMT+2"],
  ["EST", "GMT−5"],
  ["FJT", "GMT+12"],
  ["FKST", "GMT−3"],
  ["FKT", "GMT−4"],
  ["GALT", "GMT−6"],
  ["GET", "GMT+4"],
  ["GFT", "GMT−3"],
  ["GILT", "GMT+12"],
  ["GIT", "GMT−9"],
  ["GST", "GMT−2"],
  ["GST", "GMT+4"],
  ["GYT", "GMT−4"],
  ["HADT", "GMT−9"],
  ["HAEC", "GMT+2"],
  ["HAST", "GMT−10"],
  ["HKT", "GMT+8"],
  ["HMT", "GMT+5"],
  ["HST", "GMT−10"],
  ["ICT", "GMT+7"],
  ["IDT", "GMT+3"],
  ["IRKT", "GMT+8"],
  ["IRST", "GMT+3:30"],
  ["IST", "GMT+5:30"],
  ["IST", "GMT+1"],
  ["IST", "GMT+2"],
  ["JST", "GMT+9"],
  ["KRAT", "GMT+7"],
  ["KST", "GMT+9"],
  ["LHST", "GMT+10:30"],
  ["LINT", "GMT+14"],
  ["MAGT", "GMT+11"],
  ["MDT", "GMT−6"],
  ["MET", "GMT+1"],
  ["MEST", "GMT+2"],
  ["MIT", "GMT−9:30"],
  ["MSD", "GMT+4"],
  ["MSK", "GMT+3"],
  ["MST", "GMT+8"],
  ["MST", "GMT−7"],
  ["MST", "GMT+6:30"],
  ["MUT", "GMT+4"],
  ["MYT", "GMT+8"],
  ["NDT", "GMT−2:30"],
  ["NFT", "GMT+11:30"],
  ["NPT", "GMT+5:45"],
  ["NST", "GMT−3:30"],
  ["NT", "GMT−3:30"],
  ["NZDT", "GMT+13"],
  ["NZST", "GMT+12"],
  ["OMST", "GMT+6"],
  ["PDT", "GMT−7"],
  ["PETT", "GMT+12"],
  ["PHOT", "GMT+13"],
  ["PKT", "GMT+5"],
  ["PST", "GMT−8"],
  ["PST", "GMT+8"],
  ["RET", "GMT+4"],
  ["SAMT", "GMT+4"],
  ["SAST", "GMT+2"],
  ["SBT", "GMT+11"],
  ["SCT", "GMT+4"],
  ["SGT", "GMT+8"],
  ["SLT", "GMT+5:30"],
  ["SST", "GMT−11"],
  ["SST", "GMT+8"],
  ["TAHT", "GMT−10"],
  ["THA", "GMT+7"],
  ["UTC",	"GMT"],
  ["UYST", "GMT−2"],
  ["UYT", "GMT−3"],
  ["VET", "GMT−4:30"],
  ["VLAT", "GMT+10"],
  ["WAT", "GMT+1"],
  ["WEDT", "GMT+1"],
  ["WEST", "GMT+1"],
  ["WET", "GMT"],
  ["WST", "GMT+8"],
  ["YAKT", "GMT+9"],
  ["YEKT", "GMT+5"]
];

export function parse(data: string, settings: any) : Timespan[] {

  let lines = data.split("\n");
  let keywords: string[] = lines.map(l => l.split(" at ")[0]);
  let areTimepoints = !!keywords.reduce( (a, b) => (a === b) ? a : null );

  if (areTimepoints)
    return parseTimepoints(lines, settings);
  else
    return parseTimespans(lines, settings);
  
}

function parseTimespans(lines: string[], settings: any) : Timespan[] {
  let useLastOccurenceOfKeywordAsEnd = settings.lastocc.getSetting();

  let keyword = "",
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

  settings.mergebreaks.reset();
  settings.remshortenthan.reset();

  return timespans;
}

function parseTimepoints(lines: string[], settings: any) : Timespan[] {
  
  // Because I was an idiot when I firt made this, and because
  // I don't have the time or will to completely remake this tool
  // I decided to convert a single timepoint into a timespan of length 1.

  let timepoints = lines.map((l, i) => {
    let timestamp = new Date(l.split(" at ")[1]);
    return new Timespan(i, timestamp, new Date(timestamp.getTime() + 1000) );
  });

  settings.mergebreaks.enabled = false;
  settings.remshortenthan.enabled = false;

  return timepoints;
}

