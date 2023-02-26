import { normalizeResponse } from "../../http/fetch";
import axios from "axios";
import { LocalStorageService } from "../../localStorage/local-storage";
import { OutgoingPaymentMethodEnums } from "../outgoing/types";
import { SalesInterface, SalesReportsInterface } from "./types";
import { HttpResponse } from "../../http/types";

export class SalesService {
  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {}

  private getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || "";
  }

  async create(params: {
    idclients: number | null;
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
    paymentMethod: OutgoingPaymentMethodEnums;
  }): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/sales`,
          {
            idclients: params.idclients,
            description: params.description,
            date: params.date,
            total: params.total,
            paymentStatus: params.paymentPending ? "PAID" : "PENDING",
            paymentDate: params.paymentDate || null,
            paymentMethod: params.paymentMethod
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken()}`
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

  async findByDate(date: string): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/date`, {
          params: { date },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async findByPeriod(
    date1: string,
    date2: string
  ): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/period`, {
          params: { date1, date2 },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async findByClient(
    idclients: number
  ): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/client`, {
          params: { idclients },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async findPending(): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/pending`, {
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async findPendingByClient(
    idclients: number
  ): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/pending/client`, {
          params: { idclients },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async fetchByAllFilter(params: {
    idclients: number;
    date: string;
    period: {
      date1: string;
      date2: string;
    };
    pending: boolean;
  }): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/all-filters`, {
          params: {
            idclients: params.idclients,
            date: params.date,
            period: params.period,
            pending: params.pending
          },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  async registerPayment(
    idsales: number
  ): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/sales/register-payment`,
          {
            idsales
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken()}`
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

  async delete(idsales: number): Promise<HttpResponse<SalesInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/sales`, {
          params: { idsales },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

  countTotalValueSales(prices: number[]): string {
    return prices
      .filter(item => !!item)
      .reduce((acc, item) => acc + item, 0)
      .toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  }

  async findReports(
    date1: string,
    date2: string
  ): Promise<HttpResponse<SalesReportsInterface>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/reports`, {
          params: { date1, date2 },
          headers: {
            Authorization: `Bearer ${this.getToken()}`
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

const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

export const findSalesByClient = async (
  idclients: number
): Promise<HttpResponse<SalesInterface[]>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_RV_BASE_URI}/api/sales/client`, {
        params: { idclients },
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`
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
};

export const findSalesPendingByClient = async (
  idclients: number
): Promise<HttpResponse<SalesInterface[]>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_RV_BASE_URI}/api/sales/pending/client`, {
        params: { idclients },
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`
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
};
