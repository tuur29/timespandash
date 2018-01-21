import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../material.module';

import { SettingsModule } from '../../parts/settings/settings.module';
import { LogsModule } from '../../parts/logs/logs.module';
import { StatsModule } from '../../parts/stats/stats.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' },
    ]),
    CommonModule,
    MaterialModule,

    SettingsModule,
    LogsModule,
    StatsModule
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
