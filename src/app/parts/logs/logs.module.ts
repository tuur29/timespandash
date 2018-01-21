import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogsComponent } from './logs.component';
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
  exports: [LogsComponent],
  declarations: [LogsComponent]
})
export class LogsModule { }
