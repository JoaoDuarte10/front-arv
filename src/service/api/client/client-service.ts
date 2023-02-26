import axios from "axios";
import { LocalStorageService } from "../../localStorage/local-storage";
import { HttpResponse } from "../../http/types";
import { normalizeResponse } from "../../http/fetch";
import { ClientFormData, ClientsInterface } from "./types";

export class ClientService {
  constructor(
    readonly baseUri: string,
    readonly localStorageService: LocalStorageService
  ) {}

  getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || "";
  }

  async fetchAllClients(): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/client/all`, {
          headers: {
            Authorization: `Bearer ${this.localStorageService.getAccessToken()}`
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

  async createClient(params: {
    name: string;
    email: string;
    phone: string;
    address: string;
    addressNumber: number;
    note: string | null;
    idsegment: number | null;
  }): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(
          `${this.baseUri}/api/client`,
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

  async editClient(params: {
    idclients: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    addressNumber: number;
    note: string | null;
    idsegment: number | null;
  }): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .put(
          `${this.baseUri}/api/client`,
          {
            idclients: params.idclients,
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

  async deleteClient(idclients: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/client`, {
          params: {
            idclients: idclients
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
}

const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

export const fetchAllClients = async (): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_RV_BASE_URI}/api/client/all`, {
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

export const fetchClientById = async (
  id: number
): Promise<HttpResponse<ClientsInterface>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_RV_BASE_URI}/api/client/${id}`, {
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

export const createClient = async (
  params: ClientFormData
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .post(
        `${API_RV_BASE_URI}/api/client`,
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
            Authorization: `Bearer ${localStorageService.getAccessToken()}`
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
};

export const editClient = async (
  params: ClientFormData
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .put(
        `${API_RV_BASE_URI}/api/client`,
        {
          idclients: params.idclients,
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
            Authorization: `Bearer ${localStorageService.getAccessToken()}`
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
};

export const deleteClient = async (
  idclients: number
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .delete(`${API_RV_BASE_URI}/api/client`, {
        params: {
          idclients: idclients
        },
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
