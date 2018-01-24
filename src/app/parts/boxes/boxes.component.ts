import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';
import { exportsvg } from 'd3helper';


@Component({
  selector: 'app-boxes',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>All Timespans
            <span *ngIf="!hide" (click)="onExport($event)"><mat-icon matTooltip="Export SVG">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <svg width="800" height="400"></svg>

        <app-settings [settings]="settings" panelName="boxes"
          (onSettingsChange)="onSettingsChange($event)"></app-settings>

    </mat-expansion-panel>

  `,
  styles: [`

    :host ::ng-deep .mat-expansion-panel-body {
      max-height: 800px;
      overflow-y: auto;
    }

    svg {
      display: block;
      margin: 15px auto 0 auto;
    }

    :host ::ng-deep .axis text,
    :host ::ng-deep rect.black {
      fill: #eee;
    }

    :host ::ng-deep rect.black {
      cursor: pointer;
    }

    :host ::ng-deep .axis .tick line {
      stroke: #666;
    }

    :host ::ng-deep .axis .tick:nth-of-type(even) line {
      stroke: #aaa;
    }
    
    :host ::ng-deep .axis path {
      stroke: #eee;
    }

  `]
})
export class BoxesComponent implements OnInit {

  @Output() onSpanClick = new EventEmitter<string>();
  @LocalStorage("hideBoxes") hide = true;
  timespans: Timespan[];
  settings = {
    split: new Setting("Split timespans at midnight on monday",undefined,undefined,true),
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
      let data = parse(this.timespans,this.settings);
      let svg = this.el.querySelector("svg");
      if (svg && data)
        draw(svg, data, this.settings, this.d3, this.onSpanClick);
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
