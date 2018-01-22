import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [CalendarComponent],
  declarations: [CalendarComponent]
})
export class CalendarModule { }
