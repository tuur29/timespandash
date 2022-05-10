import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';
import { exportsvg } from 'src/d3helper';


@Component({
  selector: 'app-bargraph',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Bargraph<span *ngIf="!hide">: {{ settings.bargraph.getSetting() }}</span>
            <span *ngIf="!hide" (click)="onExport($event)"><mat-icon matTooltip="Export SVG">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="400" height="250"></svg>

        <app-settings [settings]="settings" panelName="bargraph"
          (onSettingsChange)="onSettingsChange($event)"></app-settings>

    </mat-expansion-panel>

  `,
  styles: [`

    svg {
      display: block;
      margin: 15px auto 0 auto;
    }

    :host ::ng-deep .axis text {
      fill: #eee;
    }
    
    :host ::ng-deep .axis line,
    :host ::ng-deep .axis path,
    :host ::ng-deep .trendline {
      stroke: #eee;
    }

  `]
})
export class BarGraphComponent implements OnInit {

  @LocalStorage("hideBarGraph") hide = true;
  timespans: Timespan[];

  options = ["Day of week","Times of day","Months of year","Years"];
  settings = {
    bargraph: new Setting("bargraph","Select type","select",this.options),
    timescount: new Setting("timescount","Count number of timespans instead of length"),
    centercount: new Setting("centercount","Use center of timespan instead of start"),
    endcount: new Setting("endcount","Use end of timespan instead of start (Hours only)"),
    counteachhour: new Setting("counteachhour","Count each hour between start & end (Hours only)"),
    avgvaluemon: new Setting("avgvaluemon","Weigh data based on months (Months & Years only)"),
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
        draw(svg, data, this.d3);
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
