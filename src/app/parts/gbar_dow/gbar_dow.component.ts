import { Component, OnInit, Input } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse, draw } from './helper';

@Component({
  selector: 'app-gbardow',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="hide=false;update(undefined)"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Day of Week</h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

      <!-- Content -->
      <ng-container *ngIf="!hide">



        <app-settings [settings]="settings" panelName="home"
            (onSettingsChange)="onSettingsChange($event)"></app-settings>

      </ng-container>
    </mat-expansion-panel>

  `,
  styles: [`



  `]
})
export class GBarDOWComponent implements OnInit {

  @LocalStorage("hideGBarDOW") hide = false;

  timespans: Timespan[];
  settings = {
    test: new Setting("Test"),
  };

  constructor() {}
  ngOnInit() {}

  update(timespans?: Timespan[]) {

    if (timespans != undefined)
      this.timespans = timespans;

    if (!this.hide && this.timespans.length > 0) {
      parse(this.timespans, this.settings);
      draw(this.timespans);
    }
  }

  onSettingsChange(settings: any) {
    this.settings = settings;
    this.update();
  }
  
}
