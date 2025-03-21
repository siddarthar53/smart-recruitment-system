import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role']; // Expected role from route data
    const userRole = this.authService.getUserRole();

    // Prevent access to login/signup when already logged in
    if (route.routeConfig?.path === '/login' || route.routeConfig?.path === '/sign-up') {
      if (this.authService.isAuthenticated()) {
        this.router.navigate([userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
        return false;
      }
      return true; // Allow navigation to login/signup if not logged in
    }

    // If a user tries to access a route they are not authorized for, redirect them (DO NOT DELETE localStorage)
    if (expectedRole && userRole !== expectedRole) {
      this.router.navigate([userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
      return false;
    }

    return true;
  }
}
