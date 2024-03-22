import { HttpInterceptorFn } from '@angular/common/http';

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  
  req = req.clone({
    headers: req.headers.set('Cache-Control', 'no-cache, must-revalidate, post-check=0, pre-check=0')
  });

  return next(req);
};
