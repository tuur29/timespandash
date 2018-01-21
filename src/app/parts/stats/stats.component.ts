import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse } from './parse';


@Component({
  selector: 'app-stats',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Stats</h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

      <!-- Content -->
      <ng-container *ngIf="!hide">

        <mat-list>
          <mat-list-item
            *ngFor="let stat of stats"
            (click)="showLog(stat.timespan ? stat.timespan.line : -1)">
            {{stat.name}}: &nbsp;<strong>{{stat.value}}</strong>
            <span *ngIf="stat.timespan">({{stat.timespan.printDate()}})</span>
          </mat-list-item>
        </mat-list>

      </ng-container>
    </mat-expansion-panel>

  `,
  styles: [`

    mat-expansion-panel {
      min-width: 450px;
    }

    mat-list {
      max-height: 450px;
      overflow-y: auto;
    }

    mat-list-item {
      cursor: pointer;
    }

    mat-list-item:hover {
      text-decoration: underline;
    }

    mat-list span {
      text-decoration: none !important;
      opacity: 0.7;
      margin-left: 5px;
      font-size: 0.8em;
    }

    :host ::ng-deep .mat-list .mat-list-item .mat-list-item-content {
      height: 32px;
    }

  `]
})
export class StatsComponent implements OnInit {

  @Output() onStatClick = new EventEmitter<number>();
  @LocalStorage("hideStats") hide = false;

  timespans: Timespan[];
  stats: Stat[] = [];

  constructor() {}
  ngOnInit() {}

  update(timespans?: Timespan[]) {

    if (timespans != undefined)
      this.timespans = timespans;

    if (!this.hide && this.timespans.length > 0) {
      this.stats = [
        new Stat("Most times per day", 0),
        new Stat("Total times recorded", 0),
        new Stat("Total days recorded", 0),
        new Stat("Total length", 0),
        new Stat("Longest ever", 0),
        new Stat("Shortest ever", Number.MAX_SAFE_INTEGER),
        new Stat("Longest time between", 0),
        new Stat("Shortest time between", Number.MAX_SAFE_INTEGER),
        new Stat("Average times per recorded day", 0),
        new Stat("Average length per day", 0),
        new Stat("Average percentage of day", 0),
        new Stat("Median of starttime", []),
        new Stat("Median of endtime", []),
        new Stat("Longest time on one day", 0),
      ];
      
      parse(this.timespans, this.stats);
    }
  }

  showLog(l: number) {
    if (l > -1)
      this.onStatClick.emit(l);
  }

  onOpenPanel() {
    if (this.hide) {
      this.hide = false;
      this.update(undefined);
    }
  }
  
}

export class Stat {
  name: string;
  value: any;
  timespan?: Timespan;

  constructor(name: string, value: any, timespan?: Timespan) {
    this.name = name;
    this.value = value;
    this.timespan = timespan ? timespan : null;
  }

}
