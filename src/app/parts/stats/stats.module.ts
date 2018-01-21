import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './stats.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MaterialModule
  ],
  exports: [StatsComponent],
  declarations: [StatsComponent]
})
export class StatsModule { }
