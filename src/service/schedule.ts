import { Response, normalizeResponse } from "./fetch";
import { LocalStorageService } from "./local-storage";
import axios from "axios";

export type ScheduleInterface = {
  idschedules?: number;
  idclients: number | null;
  clientName: string | null;
  name?: string;
  phone?: string;
  description: string;
  time: string;
  date: string;
  pacote: boolean;
  atendenceCount?: number;
  totalAtendenceCount: number;
  status: string;
  createdAt?: string;
};

export class ScheduleService {
  private accessToken: string = "";

  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {
    const token = this.localStorageService.getAccessToken();
    if (token) this.accessToken = token;
  }

  async create(params: ScheduleInterface): Promise<Response<void>> {
    let response: Response = {} as Response;
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
            status: params.status
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

  async update(params: ScheduleInterface): Promise<Response<void>> {
    let response: Response = {} as Response;
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
            status: params.status
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

  async fetchByClient(
    idclients: number
  ): Promise<Response<ScheduleInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/client`, {
          params: { idclients },
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

  async fetchByDate(date: string): Promise<Response<ScheduleInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/date`, {
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

  async fetchAllExpireds(): Promise<Response<ScheduleInterface[]>> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/schedule/expireds`, {
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

  async delete(idschedules: number): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/schedule`, {
          params: { idschedules },
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

  async finish(idschedules: number): Promise<Response> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/schedule/finish`,
          { idschedules },
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
