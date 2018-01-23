import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';
import { exportsvg } from 'd3helper';


@Component({
  selector: 'app-pie',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Piechart<span *ngIf="!hide">: {{ settings.piechart.getSetting() }}</span>
            <span *ngIf="!hide" (click)="onExport($event)"><mat-icon matTooltip="Export SVG">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="300" height="300"></svg>

        <app-settings [settings]="settings" panelName="pie"
          (onSettingsChange)="onSettingsChange($event)"></app-settings>

    </mat-expansion-panel>

  `,
  styles: [`

    svg {
      display: block;
      margin: 15px auto 0 auto;
    }

  `]
})
export class PieComponent implements OnInit {

  @LocalStorage("hidePie") hide = true;
  timespans: Timespan[];

  options = ["Day of week","Times of day","Months of year"];
  settings = {
    piechart: new Setting("Select type","select",this.options[0],true,this.options),
    timescount: new Setting("Count number of timespans instead of length"),
    centercount: new Setting("Use center of timespan instead of start"),
    endcount: new Setting("Use end of timespan instead of start (Hours only)"),
    counteachhour: new Setting("Count each hour between start & end (Hours only)"),
    avgvaluemon: new Setting("Weigh data based on months (Months & Years only)",undefined,undefined,true),
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
      if (svg && data){
        draw(svg, data, this.d3);
      }
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
