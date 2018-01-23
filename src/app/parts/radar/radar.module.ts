import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadarComponent } from './radar.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [RadarComponent],
  declarations: [RadarComponent]
})
export class RadarModule { }
