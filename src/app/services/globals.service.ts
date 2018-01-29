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
  private cachedtimestamp = 0;
  @LocalStorage()
  private cachedrequest = [];
  @LocalStorage()
  private cachedplaintext: string = "";
  private cachedtimespans: Timespan[] = [];

  getTimespans(keywords: string[], force = false, settings: any): Observable<Timespan[]> {

    if (!(environment['url'])) return Observable.of(null);

    if (!force && this.cachedtimespans.length > 0
         && (new Date()).getTime() - this.cachedtimestamp < 1000*60*60*24
         && keywords[0] == this.cachedrequest[0]
         && keywords[1] == this.cachedrequest[1]) {
      return Observable.of( Timespan.cloneArray(this.cachedtimespans) );
    }

    if (!force && this.cachedplaintext != ""
         && (new Date()).getTime() - this.cachedtimestamp < 1000*60*60*24
         && keywords[0] == this.cachedrequest[0]
         && keywords[1] == this.cachedrequest[1]) {
      return Observable.of( parse(this.cachedplaintext, settings) );
    }
    
    this.loading = true;
    console.log("load");

    let url = environment['url']+keywords.join(",");
    return this.http.get(url)
      .map(res => {
        console.log("loaded");
        return this.parse(res.text(), settings, keywords);
      }).catch((err: Response) => Observable.throw(err.json()) );

  }

  parse(res: string, settings: any, keywords = []): Timespan[] {
    try {
      this.cachedtimespans = parse(res, settings);
      this.cachedrequest = keywords;
      this.cachedplaintext = res;
      this.cachedtimestamp = (new Date()).getTime();
    } catch (e) {
      console.error(e);
      alert("This data is not in the correct format!\nYou can find more info in the dev console or on Github.");
    }

    this.loading = false;
    return Timespan.cloneArray(this.cachedtimespans)
  }

}
