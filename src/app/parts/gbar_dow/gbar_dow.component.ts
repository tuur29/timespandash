import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';


@Component({
  selector: 'app-gbardow',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Day of Week</h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="400" height="250"></svg>

        <app-settings [settings]="settings" panelName="gbardow"
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
    
    :host ::ng-deep .axis line, :host ::ng-deep .axis path {
      stroke: #eee;
    }

  `]
})
export class GBarDOWComponent implements OnInit {

  @LocalStorage("hideGBarDOW") hide = true;
  timespans: Timespan[];
  settings = {
    timescount: new Setting("Count number of timespans instead of length"),
    centercount: new Setting("Use center of timespan instead of start"),
    avgvalue: new Setting("Use average value instead of total"),
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
  
}
