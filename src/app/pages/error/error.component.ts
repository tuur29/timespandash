import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'app-error',
  template: `

    <mat-card>
      <h1>Error</h1>
      <p>It looks like you either don't have access to this page, or it doesn't exist.</p>
      <p><a routerLink="/">Back to homepage</a></p>
    </mat-card>

  `,
  styles: [`

  `]
})
export class ErrorComponent implements OnInit, OnDestroy {

  redirecturl: string = '/';
  subroute: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messagesService: MessagesService
  ) {

  }

  ngOnInit() {

    this.subroute = this.route.params.subscribe((params) => {
      let status = +params.status; // (+) converts string 'id' to a number
      if (status == 302) {
        // redirect to page
        this.router.navigate([''+params.redirect]);

      } else {
        // general error with retry
        let old = this.router.url;
        this.messagesService.send('Something went wrong', 'RETRY').subscribe(() => {
          this.router.navigate([old]);
        });
        this.router.navigate(['/']);
      }
    });

  }

  ngOnDestroy() {
    this.subroute.unsubscribe();
  }

}
