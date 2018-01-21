import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { HomeComponent } from './home.component';
import { SettingsModule } from '../../parts/settings/settings.module';
import { StatsModule } from '../../parts/stats/stats.module';
import { LogsModule } from '../../parts/logs/logs.module';
import { GBarDOWModule } from '../../parts/gbar_dow/gbar_dow.module';

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
    GBarDOWModule,
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
