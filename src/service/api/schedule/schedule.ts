import { normalizeResponse } from "../../http/fetch";
import { LocalStorageService } from "../../localStorage/local-storage";
import axios from "axios";
import { ScheduleInterface } from "./types";
import { HttpResponse } from "../../http/types";

export class ScheduleService {
  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {}

  private getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || "";
  }

  async create(params: ScheduleInterface): Promise<HttpResponse<void>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/schedule`,
          {
            idclients: params.idclients,
            clientName: params.clientName,
            description: params.description,
            time: params.time,
            date: params.date,
            pacote: params.pacote,
            totalAtendenceCount: params.totalAtendenceCount,
            status: params.status,
            idCatalogs: params.idCatalogs
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

  async update(params: ScheduleInterface): Promise<HttpResponse<void>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .put(
          `${this.baseUri}/api/schedule`,
          {
            idschedules: params.idschedules,
            idclients: params.idclients,
            clientName: params.clientName,
            description: params.description,
            time: params.time,
            date: params.date,
            pacote: params.pacote,
            atendenceCount: params.atendenceCount,
            totalAtendenceCount: params.totalAtendenceCount,
            status: params.status,
            idCatalogs: params.idCatalogs
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

  async fetchByIdClient(
    idclients: number
  ): Promise<HttpResponse<ScheduleInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/client`, {
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

  async fetchByClientName(
    clientName: string
  ): Promise<HttpResponse<ScheduleInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/client/name`, {
          params: { clientName },
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

  async fetchByDate(date: string): Promise<HttpResponse<ScheduleInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/date`, {
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

  async fetchAllExpireds(): Promise<HttpResponse<ScheduleInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/expireds`, {
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

  async delete(idschedules: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/schedule`, {
          params: { idschedules },
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

  async finish(idschedules: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/schedule/finish`,
          { idschedules },
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

  async expireds(): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/expireds`, {
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

  async fetchAllHistory(): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/finished`, {
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

  async fetchMostRecentFrom(fromDate: Date): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/finished/from-date`, {
          params: { fromDate },
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
