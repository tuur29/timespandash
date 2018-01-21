import { Observable } from 'rxjs/Rx';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService {

  constructor(private snackBar: MatSnackBar) { }

  public send(message: string, action?: string, duration?: number): Observable<void> {

    let messageRef: MatSnackBarRef<SimpleSnackBar>;
    messageRef = this.snackBar.open(message, action ? action : '',
      { duration: duration || 7500 }
    );
    return messageRef.onAction();
  }

  public sendServerError(noAction?: boolean): Observable<void> {
    return this.send("Server is not available!", noAction ? '' : 'RELOAD', 1000*60*60);
  }

}
