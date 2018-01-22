import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';
import { exportsvg } from 'd3helper';


@Component({
  selector: 'app-line',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Linegraph
            <span *ngIf="!hide" (click)="onExport($event)"><mat-icon matTooltip="Export SVG">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="800" height="400"></svg>

        <app-settings [settings]="settings" panelName="line"
          (onSettingsChange)="onSettingsChange($event)"></app-settings>

    </mat-expansion-panel>

  `,
  styles: [`

    svg {
      display: block;
      margin: 15px auto 0 auto;
      cursor: move;
    }

    :host ::ng-deep .axis text {
      fill: #eee;
    }

    :host ::ng-deep .axis line,
    :host ::ng-deep .axis path {
      stroke: #222;
    }
    
    :host ::ng-deep .trendline {
      stroke: #eee;
      
    }
    :host ::ng-deep .line {
      stroke: #26A69A;
      fill: none;
    }

  `]
})
export class LineComponent implements OnInit {

  @LocalStorage("hideLine") hide = true;
  timespans: Timespan[];

  options = ["curveBasis","curveLinear","curveStep","curveCardinal","curveMonotoneX","curveCatmullRom"];
  settings = {
    timescount: new Setting("Count number of timespans instead of length"),
    cumulative: new Setting("Show cumulative data"),
    curve: new Setting("Curve interpolation","select",this.options[0],true,this.options),
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
        draw(svg, data, this.d3, this.settings);
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
