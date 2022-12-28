import { LocalStorageService } from "./local-storage";
import axios from "axios";
import { Response, normalizeResponse } from "./fetch";

export type SegmentInterface = {
  idsegments: number;
  name: string;
  createdAt: string;
};

export class SegmentService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async getAll(): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/segments`, {
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

  async create(segment: string): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/segments`, {
          name: segment
        }, {
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

  async update(idsegments: number, segment: string): Promise<Response> {
    let response: Response = {} as Response;
    try {
      console.log(idsegments, segment)
      const { data, status } = await axios
        .put(`${this.baseUri}/api/segments`,
          {
            idsegments,
            name: segment
          }, {
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

  async delete(idsegments: number): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/segments`,
          {
            params: { idsegments },
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
