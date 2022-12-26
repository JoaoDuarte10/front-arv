import axios from "axios";
import { HTTP_RESPONSE } from "../utils/constants";
import { LocalStorageService } from "./local-storage";

export type Response = {
  success: boolean,
  data: any,
  unauthorized: boolean,
  error: boolean,
  message: null,
  conflict: boolean,
  badRequest: boolean,
}

export class ClientService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async fetchAllClients(): Promise<Response> {
    const response = {
      success: false,
      data: null,
      unauthorized: true,
      error: false,
      message: null,
      conflict: false,
      badRequest: false,
    };
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/client/all`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));

      if (status === HTTP_RESPONSE.SUCCESS) {
        response.unauthorized = false;
      }

      response.success = true;
      response.data = data;
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }

  async createClinet(params: any): Promise<Response> {
    const response = {
      success: false,
      data: null,
      unauthorized: true,
      error: false,
      message: null,
      conflict: false,
      badRequest: false,
    };
    console.log(params)
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/client`,
          {
            name: params.name,
            email: params.email,
            phone: params.phone,
            idsegment: params.idsegment,
            address: params.address,
            addressNumber: params.addressNumber,
            note: params.note
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response
        }));

      if (status === HTTP_RESPONSE.SUCCESS) {
        response.unauthorized = false;
      }

      if (status === HTTP_RESPONSE.CONFLICT) {
        response.conflict = true;
      }

      if (status === HTTP_RESPONSE.BAD_REQUEST) {
        response.badRequest = true;
      }

      response.success = true;
      response.data = data;
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }
}
