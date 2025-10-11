import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, Role } from "../service/auth.service";

export const RoleGuard = (role: Role) => {
  const router = inject(Router);

  const authService = inject(AuthService);
  const tokenPayload = authService.state().tokenPayload;

  if (!tokenPayload || !tokenPayload.roles.includes(role)) {
    router.navigateByUrl('/')
    return false;
  }

  return true;
}
