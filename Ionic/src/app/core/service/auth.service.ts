import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export type Credentials = {
  username: string;
  password: string;
};

export type ResponseToken = {
  token: string;
  refresh_token: string;
};

export type TokenHeader = {
  typ: string;
  alg: string;
};

export type TokenPayload = {
  iat: number;
  exp: number;
  username: string;
  roles: string[];
};

export type TokenDecoded = {
  header: TokenHeader;
  payload: TokenPayload;
  signature: string;
};

export enum Role {
  Admin = 'ROLE_ADMIN',
  Seller = 'ROLE_SELLER',
  Redeemer = 'ROLE_REDEEMER',
  Customer = 'ROLE_CUSTOMER',
  User = 'ROLE_USER',
}

type State = {
  tokenPayload: TokenPayload | null;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly httpClient = inject(HttpClient);

  private readonly storednameToken = 'token';
  private readonly storednameRefresh = 'refresh';

  readonly urlLogin = `${environment.API_ENDPOINT}/auth/login`;
  readonly urlRefresh = `${environment.API_ENDPOINT}/auth/refresh`;

  readonly state = signal<State>({
    tokenPayload: null,
  });

  readonly tokenPayload = computed(() => this.state().tokenPayload);

  constructor() {
    const token = this.retrieveToken();

    if (token) {
      this.state.update(s => ({ ...s, tokenPayload: this.decodeToken(token).payload }));
    }
  }

  login(credentials: Credentials) {
    return this.httpClient.post<ResponseToken>(this.urlLogin, credentials).pipe(
      tap(res => {
        this.storeToken(res.token);
        this.storeRefresh(res.refresh_token);

        this.state.update(s => ({ ...s, tokenPayload: this.decodeToken(res.token).payload }));
      })
    );
  }

  logout() {
    window.localStorage.removeItem(this.storednameToken);
    window.localStorage.removeItem(this.storednameRefresh);

    this.state.update(s => ({ ...s, tokenPayload: null }));
  }

  refresh() {
    const refreshToken = this.retrieveRefresh();

    if (!refreshToken) {
      throw new Error('No refresh stored');
    }

    return this.httpClient.post<ResponseToken>(this.urlRefresh, { refresh_token: refreshToken }).pipe(
      tap(res => {
        this.storeToken(res.token);
        this.storeRefresh(res.refresh_token);

        this.state.update(s => ({ ...s, tokenPayload: this.decodeToken(res.token).payload }));
      })
    );
  }

  retrieveToken(): string | null {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    return window.localStorage.getItem(this.storednameToken);
  }

  private storeToken(token: string) {
    window.localStorage.setItem(this.storednameToken, token);
  }

  private retrieveRefresh(): string | null {
    if (isPlatformServer(this.platformId)) {
      return null;
    }

    return window.localStorage.getItem(this.storednameRefresh);
  }

  private storeRefresh(refresh: string) {
    window.localStorage.setItem(this.storednameRefresh, refresh);
  }

  private decodeToken(token: string): TokenDecoded {
    if (token.split('.').length !== 3) {
      throw new Error('Invalid token');
    }

    const [headerBase64, payloadBase64, signature] = token.split('.');

    return {
      header: JSON.parse(this.decodeBase64Url(headerBase64)),
      payload: JSON.parse(this.decodeBase64Url(payloadBase64)),
      signature,
    };
  }

  private decodeBase64Url(urlbase64Payload: string): string {
    let base64Payload = urlbase64Payload.replace(/-/g, '+').replace(/_/g, '/');

    const padding = base64Payload.length % 4;

    if (padding === 2) {
      base64Payload += '==';
    } else if (padding === 3) {
      base64Payload += '=';
    }

    return decodeURIComponent(atob(base64Payload));
  }
}
