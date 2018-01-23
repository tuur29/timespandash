import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';
import { exportsvg } from 'd3helper';


@Component({
  selector: 'app-calendar',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Calendar
            <span *ngIf="!hide" (click)="onExport($event)"><mat-icon matTooltip="Export SVG">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="800" height="400"></svg>

        <app-settings [settings]="settings" panelName="calendar"
          (onSettingsChange)="onSettingsChange($event)"></app-settings>

    </mat-expansion-panel>

  `,
  styles: [`

    svg {
      display: block;
      margin: 15px auto 0 auto;
    }

    :host ::ng-deep svg .day {
      cursor: pointer;
    }

    :host ::ng-deep svg .month {
      stroke: #eee;
      stroke-width: 1.5;
    }

    :host ::ng-deep svg .year text {
      fill: #eee;
    }

    :host ::ng-deep .mat-expansion-panel-body {
      max-height: 800px;
      overflow-y: auto;
    }

  `]
})
export class CalendarComponent implements OnInit {

  @Output() onDayClick = new EventEmitter<string>();
  @LocalStorage("hideCalendar") hide = true;
  timespans: Timespan[];

  settings = {
    timescount: new Setting("Count number of timespans instead of length"),
    centercount: new Setting("Use center of timespan instead of start"),
    endcount: new Setting("Use end of timespan instead of start"),
  };

  private d3: D3;
  private el: any;

  constructor(element: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.el = element.nativeElement;
  }

  ngOnInit() {}

  update(timespans?: Timespan[]) {

    if (timespans != undefined)
      this.timespans = timespans;

    if (!this.hide && this.timespans.length > 0) {
      let data = parse(this.timespans, this.settings);
      let svg = this.el.querySelector("svg");
      if (svg && data)
        draw(svg, data, this.d3, this.onDayClick);
    }
  }

  onOpenPanel() {
    if (this.hide) {
      this.hide = false;
      this.update(undefined);
    }
  }

  onSettingsChange(settings: any) {
    this.settings = settings;
    this.update();
  }

  onExport(event) {
    event.stopPropagation();
    exportsvg(this.el.querySelector("svg"));
  }
  
}
