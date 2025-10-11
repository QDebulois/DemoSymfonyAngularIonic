import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";

export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.state().tokenPayload) {
    router.navigateByUrl('/')

    return false;
  }

  return true;
}
