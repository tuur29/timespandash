import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GBarDOWComponent } from './gbar_dow.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [GBarDOWComponent],
  declarations: [GBarDOWComponent]
})
export class GBarDOWModule { }
