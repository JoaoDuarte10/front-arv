import { LocalStorageService } from "./local-storage";
import axios from "axios";
import { Response, normalizeResponse } from "./fetch";

export enum OutgoingInstallmentEnums {
  A_VISTA = "À vista",
  PARCELADO = "Parcelado"
}

export enum OutgoingPaymentMethodEnums {
  CARTAO_DE_CREDITO = "Cartão de crédito",
  DINHEIRO = "Dinheiro",
  PIX = "PIX",
  BOLETO = "Boleto"
}

export type OutgoingInterface = {
  idoutgoing?: number;
  description: string;
  date: Date | string;
  total: number;
  paymentMethod: OutgoingPaymentMethodEnums;
  installment: boolean | OutgoingInstallmentEnums;
  createdAt?: string;
  updatedAt?: string;
};

export class OutgoingService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async create(params: OutgoingInterface): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/outgoing`,
          {
            description: params.description,
            date: params.date,
            total: params.total,
            paymentMethod: params.paymentMethod,
            installment: params.installment
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        )
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchPaymentMethodEnums(): Promise<
    Response<OutgoingPaymentMethodEnums>
  > {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/payment-enums`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchInstallmentEnums(): Promise<Response<OutgoingInstallmentEnums>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/installment-enums`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchAll(): Promise<Response<OutgoingInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/all`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async fetchByDate(date: Date): Promise<Response<OutgoingInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/date`, {
          params: { date },
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
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
    date2: Date
  ): Promise<Response<OutgoingInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/outgoing/period`, {
          params: { date1, date2 },
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));
      response = normalizeResponse(data, status);
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }
}
