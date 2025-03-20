import { HttpInterceptorFn } from '@angular/common/http';

export const applicationInterceptor: HttpInterceptorFn = (req, next) => {
  const reqClone = req.clone({
    headers: req.headers.set(
      'Application',
      'PAINEL'
    ),
  });

  return next(reqClone);
};
