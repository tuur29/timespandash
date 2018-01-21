import { DialogsService } from './dialogs.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
  ],
  declarations: [
  ],
  providers: [
    DialogsService,
  ],
  entryComponents: [
  ],
})
export class DialogsModule { }
