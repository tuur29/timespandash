import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { D3Service, D3 } from 'd3-ng2-service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';


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
    
    :host ::ng-deep .axis line, :host ::ng-deep .axis path {
      stroke: #eee;
    }

  `]
})
export class BarGraphComponent implements OnInit {

  @LocalStorage("hideBarGraph") hide = true;
  timespans: Timespan[];

  options = ["Day of week","Times of day","Months of year","Years"];
  settings = {
    bargraph: new Setting("Select type","select",this.options[0],true,this.options),
    timescount: new Setting("Count number of timespans instead of length"),
    centercount: new Setting("Use center of timespan instead of start"),
    avgvaluemon: new Setting("Weigh data based on months (Months & Years only)"),
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

  // Source: https://stackoverflow.com/questions/23218174/
  onExport(event) {
    event.stopPropagation();

    let serializer = new XMLSerializer();
    let source = serializer.serializeToString(this.el.querySelector("svg"));

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/))
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/))
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');

    //add xml declaration & convert source to URI data scheme.
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    // let content = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([source], {type: 'text/xml+svg'}));
    a.download = 'graph.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
}
