import { LocalStorageService } from "../../localStorage/local-storage";
import axios from "axios";
import { normalizeResponse } from "../../http/fetch";
import { HttpResponse } from "../../http/types";

export class SegmentService {
  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {}

  private getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || "";
  }

  async getAll(): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/segments`, {
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

  async create(segment: string): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/segments`,
          {
            name: segment
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

  async update(idsegments: number, segment: string): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .put(
          `${this.baseUri}/api/segments`,
          {
            idsegments,
            name: segment
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

  async delete(idsegments: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/segments`, {
          params: { idsegments },
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
