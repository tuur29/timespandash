import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import { GlobalsService } from 'app/services/globals.service';
import { MessagesService } from './messages/messages.service';

@Component({
  selector: 'app',
  template: `

    <div class="mat-typography">

      <div class="loader cdk-overlay-container" *ngIf="globals.loading">
        <div class="cdk-overlay-backdrop cdk-overlay-backdrop-showing">
        </div>
        <div class="cdk-global-overlay-wrapper">
          <mat-spinner *ngIf="!globals.failed"></mat-spinner>
        </div>
      </div>

      <div class="container">
        <router-outlet></router-outlet>
      </div>

    </div>

  `,
  styles: [`

    .container {
      margin: 20px auto;
    }

    footer {
      margin: 20px 0;
      text-align: center;
    }

  `],
})
export class AppComponent implements OnInit{
  constructor(
    public globals: GlobalsService,
    public messagesService: MessagesService
  ) {}

  ngOnInit() {}
}
