import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const token = localStorage.getItem('ngaso_token');
  const isAdminApi = req.url.includes('/api/v1/admin/');
  const isAuthEndpoint = req.url.includes('/api/v1/auth/login') || req.url.includes('/api/v1/auth/refresh');

  let authReq = req;

  if (token && isAdminApi && !isAuthEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const refreshToken = localStorage.getItem('ngaso_refresh_token');

      const shouldAttemptRefresh =
        error.status === 401 &&
        !!refreshToken &&
        isAdminApi &&
        !isAuthEndpoint;

      if (!shouldAttemptRefresh) {
        return throwError(() => error);
      }

      return authService.refresh(refreshToken).pipe(
        switchMap((res) => {
          localStorage.setItem('ngaso_token', res.token);
          localStorage.setItem('ngaso_refresh_token', res.refreshToken);
          localStorage.setItem('ngaso_role', res.role);
          localStorage.setItem('ngaso_user_id', String(res.userId));

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.token}`
            }
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
