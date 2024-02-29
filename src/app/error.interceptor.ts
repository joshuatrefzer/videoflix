import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if ([401 , 403].includes(error.status)) {
        console.log('Unauthorized request');
        
        
        
      }
    return throwError(() => error);
  })) ;


};

