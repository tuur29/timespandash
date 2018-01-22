import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineComponent } from './line.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [LineComponent],
  declarations: [LineComponent]
})
export class LineModule { }
