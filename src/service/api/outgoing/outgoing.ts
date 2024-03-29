import { LocalStorageService } from '../../localStorage/local-storage';
import axios from 'axios';
import { normalizeResponse } from '../../http/fetch';
import {
  OutgoingInterface,
  OutgoingPaymentMethodEnums,
  OutgoingInstallmentEnums,
} from './types';
import { HttpResponse } from '../../http/types';

export class OutgoingService {
  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService,
  ) {}

  private getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || '';
  }

  async create(params: OutgoingInterface): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/outgoing`,
          {
            description: params.description,
            date: params.date,
            total: params.total,
            paymentMethod: params.paymentMethod,
            installment: params.installment,
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken()}`,
            },
          },
        )
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchPaymentMethodEnums(): Promise<
    HttpResponse<OutgoingPaymentMethodEnums>
  > {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/payment-enums`, {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchInstallmentEnums(): Promise<
    HttpResponse<OutgoingInstallmentEnums>
  > {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/installment-enums`, {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchAll(): Promise<HttpResponse<OutgoingInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/all`, {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchByDate(date: Date): Promise<HttpResponse<OutgoingInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/date`, {
          params: { date },
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchByPeriod(
    date1: Date,
    date2: Date,
  ): Promise<HttpResponse<OutgoingInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/period`, {
          params: { date1, date2 },
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async delete(idoutgoing: number): Promise<HttpResponse<OutgoingInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/outgoing`, {
          params: { idoutgoing },
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }
}
