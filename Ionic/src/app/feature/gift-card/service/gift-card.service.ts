import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomerRequestDto } from './customer.service';

export type GiftCardResponseDto = {
  code: string;
  initialAmount: number;
  remainingAmount: number;
  onSaleBy: string;
  boughtBy: string;
  associatedTo: string;
};

export type RedeemRequestDto = {
  amount: number;
};

@Injectable({
  providedIn: 'root',
})
export class GiftCardService {
  httpClient = inject(HttpClient);

  baseUrl = `${environment.API_ENDPOINT}/gift-card`;

  infos(qrcode: string) {
    return this.httpClient.get<GiftCardResponseDto>(`${this.baseUrl}/${qrcode}`);
  }

  sell(qrcode: string, payload: CustomerRequestDto) {
    return this.httpClient.post<any>(`${this.baseUrl}/${qrcode}/sell`, payload);
  }

  associate(qrcode: string, payload: CustomerRequestDto) {
    return this.httpClient.post<any>(`${this.baseUrl}/${qrcode}/associate`, payload);
  }

  redeem(qrcode: string, payload: RedeemRequestDto) {
    return this.httpClient.post<any>(`${this.baseUrl}/${qrcode}/redeem`, payload);
  }
}
