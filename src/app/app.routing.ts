import { Routes, Route, PreloadingStrategy } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';

import { Observable } from 'rxjs/Observable';

export const routes: Routes = [

  { path: 'error/:status/:redirect', component: ErrorComponent },
  { path: '', loadChildren: './pages/home/home.module#HomeModule', data: {preload: true} },
  { path: '**', component: ErrorComponent }

];

export class PreloadSelectedModulesList implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : typeof(null);
  }
}