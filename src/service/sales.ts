import { Response, normalizeResponse } from "./fetch";
import axios from "axios";
import { LocalStorageService } from "./local-storage";

export type SalesInterface = {
  idsales: number;
  client: string;
  idclients: number;
  description: string;
  date: string;
  total: number;
  payment_status: string;
  payment_date: string;
  created_at: string;
}

export class SalesService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async create(params: {
    idclients: number | null;
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
  }): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/sales`,
          {
            idclients: params.idclients,
            description: params.description,
            date: params.date,
            total: params.total,
            paymentStatus: params.paymentPending ? "PENDING" : "PAID",
            paymentDate: params.paymentDate || null
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

  async findByDate(date: string): Promise<Response<SalesInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/date`, {
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

  async findByPeriod(date1: string, date2: string): Promise<Response<SalesInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/period`, {
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

  async findByClient(idclients: number): Promise<Response<SalesInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/sales/client`, {
          params: { idclients },
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
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

  async registerPayment(idsales: number): Promise<Response<SalesInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/sales/register-payment`,
          {
            idsales
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
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

  async delete(idsales: number): Promise<Response<SalesInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/sales`,
          {
            params: { idsales },
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
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
      .filter((item) => !!item)
      .reduce((acc, item) => acc + item, 0)
      .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }
}
