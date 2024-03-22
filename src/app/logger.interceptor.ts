import { HttpInterceptorFn } from '@angular/common/http';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({

      headers: req.headers.set('Authorization', `Token ${token}`)
      
    });
    return next(authReq);

  }

  return next(req);


};
