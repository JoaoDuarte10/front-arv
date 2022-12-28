import { Response, normalizeResponse } from "./fetch";
import axios from "axios";
import { LocalStorageService } from "./local-storage";

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
}
