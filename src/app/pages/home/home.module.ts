import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { HomeComponent } from './home.component';
import { SettingsModule } from '../../parts/settings/settings.module';
import { StatsModule } from '../../parts/stats/stats.module';
import { LogsModule } from '../../parts/logs/logs.module';
import { BarGraphModule } from '../../parts/bargraph/bargraph.module';
import { PieModule } from '../../parts/pie/pie.module';
import { LineModule } from '../../parts/line/line.module';
import { CalendarModule } from '../../parts/calendar/calendar.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' },
    ]),
    CommonModule,
    MaterialModule,

    SettingsModule,
    StatsModule,
    LogsModule,
    BarGraphModule,
    PieModule,
    LineModule,
    CalendarModule,
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
