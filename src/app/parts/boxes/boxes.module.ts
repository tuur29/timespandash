import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsModule } from '../settings/settings.module';
import { BoxesComponent } from './boxes.component';

import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
	SettingsModule,
    MaterialModule
  ],
  exports: [BoxesComponent],
  declarations: [BoxesComponent]
})
export class BoxesModule { }
