import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('ngaso_token');
  const role = localStorage.getItem('ngaso_role');

  if (token && role === 'Admin') {
    return true;
  }

  return router.createUrlTree(['/login']);
};
