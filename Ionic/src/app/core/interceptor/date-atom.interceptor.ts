import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

export const DATE_ATOM = 'yyyy-MM-ddTHH:mm:ssZZZZZ';

export function apiDateAtomInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  if (!req.url.startsWith(environment.API_ENDPOINT)) {
    return next(req);
  }

  if (!req.body) {
    return next(req);
  }

  const datePipe = new DatePipe('fr-FR');

  return next(req.clone({ body: transformDateObjToAtom(req.body, datePipe) }));
}

function transformDateObjToAtom(data: any, datePipe: DatePipe): any {
  if (!data) {
    return data;
  }

  if (data instanceof Date) {
    return datePipe.transform(data, DATE_ATOM);
  }

  if (typeof data === 'object') {
    if (data instanceof FormData) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => transformDateObjToAtom(item, datePipe));
    }

    const clonedData = { ...data };

    for (const key of Object.keys(clonedData)) {
      clonedData[key] = transformDateObjToAtom(clonedData[key], datePipe);
    }

    return clonedData;
  }

  return data;
}
