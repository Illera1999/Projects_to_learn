import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, take } from 'rxjs';

/**
 * loginRedirectGuard
 *
 * Route guard used on the login page. It checks the current authentication state
 * via `AuthService.user$`. If there is already a logged-in user, it prevents
 * access to the login route and redirects to `/tabs/home`. If there is no user,
 * the navigation to the requested route is allowed.
 */
export const loginRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(take(1),map(user => user ? router.createUrlTree(['/tabs/home']) : true));
};
