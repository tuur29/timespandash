import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TODEvolutionComponent } from './todevolution.component';

import { MaterialModule } from '../../material.module';
import { SettingsModule } from '../settings/settings.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SettingsModule
  ],
  exports: [TODEvolutionComponent],
  declarations: [TODEvolutionComponent]
})
export class TODEvolutionModule { }
