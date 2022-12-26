import axios from "axios";
import { HTTP_RESPONSE } from "../utils/constants";
import { LocalStorageService } from "./local-storage";

export class ClientService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async fetchAllClients(): Promise<any> {
    const response = {
      success: false,
      data: null,
      unauthorized: true,
      error: false,
      message: null
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
}
