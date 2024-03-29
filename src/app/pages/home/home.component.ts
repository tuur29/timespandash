import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from 'src/environments/environment';
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

          <mat-form-field *ngIf="allPossibleKeywords.length > 1">
            <mat-select (change)="onKeywordsChange($event)" placeholder="Select data">
              <mat-option *ngFor="let set of allPossibleKeywords" [value]="set.keywords">{{set.description}}</mat-option>
            </mat-select>
          </mat-form-field>
          <p>Or drop a text (file) in the correct format here.</p>

          <app-settings *ngIf="!firsttime" [settings]="settings" panelName="home"
            (onSettingsChange)="onSettingsChange($event)"></app-settings>
        </mat-card>
      </div>


      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-stats #stats (onStatClick)="onSearchLogLine($event)"></app-stats>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-logs #logs></app-logs>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-bargraph #bargraph></app-bargraph>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-pie #pie></app-pie>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-radar #radar></app-radar>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-line #line></app-line>
      </div>
      
      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-todevolution #todevolution></app-todevolution>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-calendar #calendar (onDayClick)="onSearchLogs($event)"></app-calendar>
      </div>

      <div [style.display]="!firsttime ? 'block' : 'none'">
        <app-boxes #boxes (onSpanClick)="onSearchLogLine($event)"></app-boxes>
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
  @ViewChild('logs',{read: ElementRef}) logsEl;
  @ViewChild('bargraph') bargraph;
  @ViewChild('pie') pie;
  @ViewChild('line') line;
  @ViewChild('calendar') calendar;
  @ViewChild('boxes') boxes;
  @ViewChild('radar') radar;
  @ViewChild('todevolution') todevolution;

  firsttime = true;
  dragover;
  keywords;
  allPossibleKeywords = [];

  settings = {
    mergebreaks: new Setting("mergebreaks","Merge when break smaller than","minute"),
    remshortenthan: new Setting("remshortenthan","Remove sessions shorter than","minute"),
    lastocc: new Setting("lastocc","Use last instead of first occurence"),
    ignbeforedate: new Setting("ignbeforedate","Ignore before date","date"),
    ignafterdate: new Setting("ignafterdate","Ignore after date","date"),
  };

  constructor(
    public globals: GlobalsService
  ) {}

  ngOnInit() {
    if (environment['defaultKeywords'])
      this.onKeywordsChange({value: environment['defaultKeywords']})

    if (environment['allPossibleKeywords'])
      this.allPossibleKeywords = environment['allPossibleKeywords'];
  }

  getData(keywords?: string[], force = false) {
    if (keywords == undefined) keywords = this.keywords;
    this.globals.getTimespans(keywords, force, this.settings).subscribe(timespans => {
      if (timespans)
        this.updateAll(timespans);
    });
  }

  updateAll(timespans: Timespan[]) {
    this.firsttime = false;
    let spans = parse(timespans, this.settings);

    try { this.stats.update(spans); } catch (e) { console.error(e); }
    try { this.logs.update(spans); } catch (e) { console.error(e); }
    try { this.bargraph.update(spans); } catch (e) { console.error(e); }
    try { this.pie.update(spans); } catch (e) { console.error(e); }
    try { this.line.update(spans); } catch (e) { console.error(e); }
    try { this.calendar.update(spans); } catch (e) { console.error(e); }
    try { this.boxes.update(spans); } catch (e) { console.error(e); }
    try { this.radar.update(spans); } catch (e) { console.error(e); }
    try { this.todevolution.update(spans); } catch (e) { console.error(e); }
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

  onSearchLogLine(l: number) {
    this.onSearchLogs("("+l+")");
  }

  onSearchLogs(date: string) {
    this.logs.search(date);
    this.logsEl.nativeElement.scrollIntoView();
  }

  onFileDrop(event: any) {
    event.preventDefault();
    this.dragover = false;

    var dt = event.dataTransfer;
    let text = dt.getData('Text');

    if (text) {
      this.keywords = [];
      this.updateAll( this.globals.parse(text, this.settings) );
    }

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
      this.keywords = [];
      this.updateAll( this.globals.parse(reader.result, this.settings) );
    };
    reader.readAsText(file);
  }
}
