
import { convertTime, formatDate, formatTime, formatTimestamp } from 'convertTime';

export class Timespan {
  line: number;
  start: Date;
  end: Date;

  constructor(line: number, start: Date, end: Date) {
  	this.line = line;
  	this.start = start;
  	this.end = end;
  }

  getLength(): number {
  	return this.end.getTime() - this.start.getTime();
  }

  getCenter(): Date {
    return new Date(Math.round((this.end.getTime()-this.start.getTime())/2) + this.start.getTime());
  }

  static cloneArray(timespans: Timespan[]): Timespan[] {
    return timespans.slice(0).map(t => 
        new Timespan(t.line,t.start,t.end));
  }

  // PRINTING

  printDate(): string {
    return formatDate(this.start);
  }

  printStart(): string {
    return formatTimestamp(this.start);
  }

  printEnd(): string {
    return formatTimestamp(this.end);
  }

  print(): string {
    return this.printStart() + " → " + this.printEnd();
  }

  printShort(): string {
    // TODO: edit to: Jan 1 12:23 -> Jan 1 15:56
    return formatTimestamp(this.start) + " → " + formatTimestamp(this.end);
  }

  printFull(): string {
    return this.start.toString().split(" (")[0] + " → " + this.end.toString().split(" (")[0];
  }

  printLength() {
    return convertTime(this.getLength());
  }

}
