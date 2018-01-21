import { Observable } from 'rxjs/Rx';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class DialogsService {

  constructor(private dialog: MatDialog) { }

}
