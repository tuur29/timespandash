import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from 'ngx-store';
import { MessagesService } from '../messages/messages.service';
import { Timespan } from 'app/models/timespan';
import { Setting } from 'app/models/setting';
import { parse } from './parse';

import { environment } from 'environments/environment';

@Injectable()
export class GlobalsService {

  loading: boolean = false;

  constructor(
    private http: Http,
    public messagesService: MessagesService
  ) {}

  @LocalStorage()
  private cachedrequest = ['',''];
  @LocalStorage()
  private cachedplaintext: string = "";
  private cachedtimespans: Timespan[] = [];

  getTimespans(keywords: string[], force = false, settings: any): Observable<Timespan[]> {

    if (!force && this.cachedtimespans.length > 0
         && keywords[0] == this.cachedrequest[0]
         && keywords[1] == this.cachedrequest[1]) {
      return Observable.of( this.clone(this.cachedtimespans) );
    }

    if (!force && this.cachedplaintext != ""
         && keywords[0] == this.cachedrequest[0]
         && keywords[1] == this.cachedrequest[1]) {
      return Observable.of( parse(this.cachedplaintext, settings) );
    }
    
    this.loading = true;

    let url = environment.url+'?'+keywords.join(",");
    return this.http.get(url)
      .map(res => {
        return this.parse(res.text(), settings, keywords);
      }).catch((err: Response) => Observable.throw(err.json()) );

  }

  parse(res: string, settings: any, keywords = []): Timespan[] {
    this.cachedrequest = keywords;
    this.cachedplaintext = res;
    this.cachedtimespans = parse(this.cachedplaintext, settings);
    this.loading = false;
    return this.clone(this.cachedtimespans)
  }

  private clone(timespans: Timespan[]): Timespan[] {
    return this.cachedtimespans.slice(0).map(t => 
        new Timespan(t.line,t.start,t.end));
  }

}
