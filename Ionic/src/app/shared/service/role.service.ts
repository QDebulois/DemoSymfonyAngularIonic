import { computed, inject, Injectable } from '@angular/core';
import { Role } from '../enum/role.enum';
import { AuthService } from 'src/app/core/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  authService = inject(AuthService);

  isGrantedSeller = computed((): boolean => this.isGranted(Role.SELLER));
  isGrantedRedeemer = computed((): boolean => this.isGranted(Role.REDEEMER));
  isGrantedCustomer = computed((): boolean => this.isGranted(Role.CUSTOMER));

  isGranted(role: Role): boolean {
    const roles = this.authService.state().tokenPayload?.roles;

    return roles ? roles.includes(role) : false;
  }
}
