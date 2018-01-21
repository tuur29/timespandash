import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MaterialModule,
    FormsModule,
  ],
  exports: [SettingsComponent],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
