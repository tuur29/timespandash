import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalsService } from 'app/services/globals.service';
import { LocalStorageService } from 'ngx-store';
import { Setting } from 'app/models/setting';


@Component({
  selector: 'app-settings',
  template: `

    <mat-expansion-panel
      [expanded]="!hide"
      (opened)="hide=false;toggled()"
      (closed)="hide=true;toggled()">

      <mat-expansion-panel-header>
        <mat-panel-title>
          <h2>Settings</h2>
        </mat-panel-title>
      </mat-expansion-panel-header>

        <!-- Content -->
        <form>

            <div *ngFor="let i of keys(settings)">

              <mat-checkbox *ngIf="settings[i].type!='select'" [checked]="settings[i].enabled" (change)="onCheckToggle(i)">
                {{ settings[i].description }}
              </mat-checkbox>

              <mat-form-field *ngIf="settings[i].type">

                <mat-select *ngIf="settings[i].type=='select'; else fallback"
                  (change)="onSelect(i, $event)"
                  [placeholder]="settings[i].description">
                  <mat-option *ngFor="let j of settings[i].options" [value]="j">
                    {{j}}
                  </mat-option>
                </mat-select>

                <ng-template #fallback>
                  <input matInput [type]="settings[i].type == 'minute' ? 'number' : settings[i].type" [value]="settings[i].value" [disabled]="!settings[i].enabled" (change)="onValueChange(i, $event)" />
                </ng-template>
              </mat-form-field>
              <ng-container *ngIf="settings[i].type == 'minute'">min</ng-container>

            </div>

            <button type="button" (click)="onReset()" mat-button color="primary">
              <mat-icon>refresh</mat-icon> Reset
            </button>
          
        </form>

      </mat-expansion-panel>

  `,
  styles: [`

    mat-expansion-panel {
      margin-top: 20px;
    }

    .mat-expansion-panel-header-title h2, button {
      margin-top: 16px;
    }

    :host ::ng-deep .mat-expansion-panel-body {
      padding-bottom: 20px;
    }

    label {
      display: block;
    }

    button {
      float: right;
    }

    mat-form-field {
      margin-left: 30px;
      max-width: 135px;
    }

  `]
})
export class SettingsComponent implements OnInit {

  @Input() panelName: string = "";
  @Input() settings: Setting[] = [];
  @Output() onSettingsChange = new EventEmitter<Setting[]>();

  hide = false;
  keys = Object.keys;

  constructor(
    public globals: GlobalsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    let h = this.localStorageService.get('hideSettings'+this.panelName);
    if (h)
      this.hide = h;
  }

  toggled() {
    this.localStorageService.set('hideSettings'+this.panelName, this.hide);
  }

  onCheckToggle(i: number) {
    this.settings[i].enabled = !this.settings[i].enabled;
    this.submit();
  }

  onValueChange(i: number, event: any) {
    this.settings[i].value = event.target.value;
    this.submit();
  }

  onSelect(i: number, event: any) {
    this.settings[i].value = event.value;
    this.submit();
  }

  onReset() {
    for (let i in this.settings)
      this.settings[i].reset();
    this.submit();
  }

  submit() {
    this.onSettingsChange.emit(this.settings);
  }

}
