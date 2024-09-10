import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const login = inject(LoginService);

  if (token  && login.isLoggedIn()) {
    console.log("User is authenticated");
    return true; 
  } else {
    console.log("User is not authenticated, redirecting to login...");
    router.navigate(['/login']); 
    return false;
  }
};
