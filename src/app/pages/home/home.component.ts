import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalsService } from 'app/services/globals.service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse } from './parse';

@Component({
  selector: 'app-home',
  template: `

    <div class="cardsgrid"
      [style.max-width]="firsttime ? '600px' : ''"
      [style.margin]="firsttime ? '0 auto' : ''">

      <div (drop)="onFileDrop($event)" (dragover)="$event.preventDefault();dragover=true" (dragleave)="dragover=false">
        <mat-card class="settings" [class.dragover]="dragover">

          <button *ngIf="!firsttime" type="button" (click)="onRefreshData()" mat-raised-button color="primary">
            <mat-icon>refresh</mat-icon> Refresh Data
          </button>

          <mat-form-field>
            <mat-select (change)="onKeywordsChange($event)" placeholder="Select data">
              <mat-option value="boot,shut">PC</mat-option>
              <mat-option value="sleep,wake">Sleep</mat-option>
              <mat-option value="start,stop">Session</mat-option>
              <mat-option value="all,null">All</mat-option>
            </mat-select>
          </mat-form-field>
          <p>Or drop a text (file) in the correct format here.</p>


          <app-settings *ngIf="!firsttime" [settings]="settings" panelName="home"
            (onSettingsChange)="onSettingsChange($event)"></app-settings>
        </mat-card>
      </div>


      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-stats #stats (onStatClick)="onStatClick($event)"></app-stats>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-logs #logs></app-logs>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-gbardow #gbardow></app-gbardow>
      </div>
      

    </div>

  `,
  styles: [`

    @media (min-width: 650px) {
      .cardsgrid {
        display: flex;
        flex-flow: row wrap;
        align-items: start;
      }

      .cardsgrid > * {
        flex: 1 1 300px;
        padding: 10px;
      }
    }

    @media (max-width: 649px) {
      .cardsgrid > * {
        margin: 20px 0;
      }
    }

    .settings mat-form-field, .settings button {
      margin: 10px;
    }
     
    :host ::ng-deep mat-expansion-panel-header {
      min-height: 64px !important;
    }

    :host ::ng-deep mat-panel-title h1 {
      margin: 0;
    }

    :host ::ng-deep .mat-expansion-indicator {
      margin-top: -5px !important;
    }

  `]
})
export class HomeComponent implements OnInit {

  @ViewChild('stats') stats;
  @ViewChild('logs') logs;
  @ViewChild('gbardow') gbardow;

  firsttime = true;
  dragover;
  keywords;

  settings = {
    mergebreaks: new Setting("Merge when break smaller than","number","10", true),
    remshortenthan: new Setting("Remove sessions shorter than","number","10", true),
    lastocc: new Setting("Use last instead of first occurence"),
    ignbeforedate: new Setting("Ignore before date","date"),
    ignafterdate: new Setting("Ignore after date","date"),
  };

  constructor(
    public globals: GlobalsService
  ) {}

  ngOnInit() {
    // set default dataset for dev
    this.onKeywordsChange({value: "sleep,wake"})
  }

  getData(keywords?: string[], force = false) {
    if (keywords == undefined) keywords = this.keywords;
    this.globals.getTimespans(keywords, force, this.settings).subscribe(timespans => {
      this.updateAll(timespans);
    });
  }

  updateAll(timespans: Timespan[]) {
    this.firsttime = false;
    let spans = parse(timespans, this.settings);

    this.stats.update(spans);
    this.logs.update(spans);
    this.gbardow.update(spans);
  }

  // Event Listeners

  onSettingsChange(settings: any) {
    this.settings = settings;
    if (!this.firsttime)
      this.getData();
  }

  onRefreshData() {
    this.getData(undefined,true);
  }

  onKeywordsChange(keywords: any) {
    this.keywords = keywords.value.split(",");
    this.getData(this.keywords);
  }

  onStatClick(l: number) {
    this.logs.goToLine(l);
  }

  onFileDrop(event: any) {
    event.preventDefault();
    this.dragover = false;

    var dt = event.dataTransfer;
    let text = dt.getData('Text');

    if (text)
      this.updateAll( this.globals.parse(text, this.settings) );

    if (dt.items) {
      // Use DataTransferItemList interface to access the file(s)
      if (dt.items[0].kind == "file")
        this.readFile(dt.items[0].getAsFile());

    } else {
      // Use DataTransfer interface to access the file(s)
      this.readFile(dt.files[0])
    }
  }

  private readFile(file: File) {
    let reader = new FileReader();
    reader.onload = () => {
      this.updateAll( this.globals.parse(reader.result, this.settings) );
    };
    reader.readAsText(file);
  }
}
