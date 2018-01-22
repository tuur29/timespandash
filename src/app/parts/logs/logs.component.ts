import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-store';
import { removeDiacritics } from 'removeDiacritics';
import { Timespan } from 'app/models/timespan';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-logs',
  template: `

  <mat-expansion-panel
      [expanded]="!hide"
      (opened)="onOpenPanel()"
      (closed)="hide=true">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h1>Logs
            <span *ngIf="!hide" (click)="onExportParsed($event)"><mat-icon matTooltip="Export parsed">file_download</mat-icon></span>
          </h1>
        </mat-panel-title>
      </mat-expansion-panel-header>

      <!-- Content -->
      <ng-container *ngIf="!hide">

        <form>
          <mat-form-field class="full-width">

            <button mat-icon-button matPrefix>
              <mat-icon>search</mat-icon>
            </button>

            <input matInput placeholder="Search timestamps or line numbers" aria-label="Search names" [formControl]="logsCtrl">

            <button *ngIf="logsCtrl.value" matSuffix mat-icon-button aria-label="Reset" (click)="logsCtrl.reset()">
            <mat-icon>close</mat-icon>
          </button>

          </mat-form-field>
        </form>

        <mat-list>
          <mat-list-item *ngFor="let timespan of filteredLogs | async">
            <span>({{timespan.line}})</span>&nbsp; {{timespan.print()}}
          </mat-list-item>
        </mat-list>

      </ng-container>
    </mat-expansion-panel>

  `,
  styles: [`

    :host ::ng-deep .mat-expansion-panel-content {
      overflow-x: auto;
    }

    :host ::ng-deep .mat-expansion-panel-body {
      min-width: 425px;
    }

    mat-panel-title span {
      margin-left: 5px;
    }

    mat-list {
      max-height: 400px;
      overflow-y: auto;
    }

    mat-list-item span {
      opacity: 0.5;
      font-size: 0.75em;
    }

    :host ::ng-deep .mat-list .mat-list-item .mat-list-item-content {
      height: 32px;
    }

  `]
})
export class LogsComponent implements OnInit {

  @LocalStorage("hideLogs") hide = true;

  // variables
  timespans: Timespan[] = [];
  logsCtrl: FormControl = new FormControl();
  filteredLogs: Observable<Timespan[]>;

  constructor() {}

  ngOnInit() {
    this.filteredLogs = this.logsCtrl.valueChanges
      .startWith(null)
      .map(timespan => timespan ? this.filter(timespan) : this.timespans.slice());
  }

  filter(query: string) {
    return this.timespans.filter(timespan =>
      this.normalize(timespan.printStart()).indexOf(this.normalize(query)) > -1 ||
      this.normalize(timespan.printEnd()).indexOf(this.normalize(query)) > -1 ||
      ("("+timespan.line+")").indexOf(query) > -1
    );
  }

  update(timespans: Timespan[]) {
    if (timespans != undefined)
      this.timespans = timespans.reverse();

    if (!this.hide) {
      this.timespans = this.timespans;
      this.logsCtrl.reset();
    }
  }

  goToLine(l: number) {
    if (!this.hide)
      this.logsCtrl.setValue("("+l+")");
  }

  onExportParsed(event: any) {
    event.stopPropagation();

    let content = this.timespans.reverse().map((t) => t.printFull()).join("\n");

    let a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    a.download = 'logs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
  }

  onOpenPanel() {
    if (this.hide) {
      this.hide = false;
      this.update(undefined);
    }
  }

  private normalize(s: string) {
    return removeDiacritics(s.toLowerCase());
  }
}
