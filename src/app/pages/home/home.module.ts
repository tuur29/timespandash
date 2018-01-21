import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { HomeComponent } from './home.component';
import { SettingsModule } from '../../parts/settings/settings.module';
import { StatsModule } from '../../parts/stats/stats.module';
import { LogsModule } from '../../parts/logs/logs.module';
import { BarGraphModule } from '../../parts/bargraph/bargraph.module';

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
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
