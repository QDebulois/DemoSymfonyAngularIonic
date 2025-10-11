import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';

const isRefreshingDone$: BehaviorSubject<boolean> = new BehaviorSubject(true);

export function apiAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!req.url.startsWith(environment.API_ENDPOINT)) {
    return next(req);
  }

  const authService = inject(AuthService);

  const token = authService.retrieveToken();

  if (!token || req.url === authService.urlRefresh) {
    return next(req);
  }

  const tokenPayload = authService.tokenPayload();

  if (!tokenPayload) {
    throw new Error('Error token payload stored');
  }

  const dateNow = new Date();
  const dateExp = new Date(tokenPayload.exp * 1000);

  if (dateExp > dateNow) {
    return setTokenAndNext(req, next);
  }

  if (true === isRefreshingDone$.getValue()) {
    isRefreshingDone$.next(false);
    authService.refresh().subscribe(() => isRefreshingDone$.next(true));
  }

  return isRefreshingDone$.pipe(
    filter(isRefreshingDone => isRefreshingDone),
    switchMap(() => setTokenAndNext(req, next)),
  );
}

function setTokenAndNext(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);

  const token = authService.retrieveToken();

  if (!token) {
    throw new Error('Error token stored');
  }

  return next(req.clone({ headers: req.headers.append('Authorization', `Bearer ${token}`) }));
}

