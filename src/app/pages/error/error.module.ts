import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';

import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule
  ],
  declarations: [ErrorComponent]
})
export class ErrorModule { }
