import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export type CustomerRequestDto = {
  email: string;
};

export type CustomerResponseDto = {
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  httpClient = inject(HttpClient);

  baseUrl = `${environment.API_ENDPOINT}/customer`;

  all() {
    return this.httpClient.get<CustomerResponseDto[]>(`${this.baseUrl}`);
  }
}
