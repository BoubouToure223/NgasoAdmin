import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('ngaso_token');

  if (!token) {
    return next(req);
  }

  const isAdminApi = req.url.includes('/api/v1/admin/');

  if (!isAdminApi) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
