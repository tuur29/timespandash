import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieComponent } from './pie.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [PieComponent],
  declarations: [PieComponent]
})
export class PieModule { }
