import axios from 'axios';
import { LocalStorageService } from '../../localStorage/local-storage';
import { HttpResponse } from '../../http/types';
import { normalizeResponse } from '../../http/fetch';
import { ClientFormData, ClientsInterface } from './types';

export class ClientService {
  constructor(
    readonly baseUri: string,
    readonly localStorageService: LocalStorageService,
  ) {}

  getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || '';
  }

  async fetchAllClients(): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/client`, {
          headers: {
            Authorization: `Bearer ${this.localStorageService.getAccessToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
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
            note: params.note,
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken()}`,
            },
          },
        )
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
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
        .patch(
          `${this.baseUri}/api/client`,
          {
            idclients: params.idclients,
            name: params.name,
            email: params.email,
            phone: params.phone,
            idsegment: params.idsegment,
            address: params.address,
            addressNumber: params.addressNumber,
            note: params.note,
          },
          {
            headers: {
              Authorization: `Bearer ${this.getToken()}`,
            },
          },
        )
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
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
            idclients: idclients,
          },
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        })
        .then(res => ({ data: res.data, status: res.status }))
        .catch(err => ({
          data: err.response ? err.response.data : err.response,
          status: err.response ? err.response.status : err.response,
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
      .get(`${API_RV_BASE_URI}/api/client`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    response = normalizeResponse(data, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};

export const fetchClientById = async (
  id: number,
): Promise<HttpResponse<ClientsInterface>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_RV_BASE_URI}/api/client/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    response = normalizeResponse(data, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};

export const createClient = async (
  params: ClientFormData,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const cep =
      (params.address &&
        params.address.cep &&
        ((typeof params.address.cep === 'string' &&
          params.address.cep.trim().replace(/\D/gi, '')) ||
          params.address.cep)) ||
      null;

    const { data, status } = await axios
      .post(
        `${API_RV_BASE_URI}/api/client`,
        {
          name: params.name && params.name.trim(),
          email: (params.email && params.email.trim()) || null,
          phone: (params.phone && params.phone.trim()) || null,
          idsegment: params.idsegment,
          address: {
            cep,
            address:
              (params.address &&
                params.address.address &&
                params.address.address.trim()) ||
              null,
            city:
              (params.address &&
                params.address.city &&
                params.address.city.trim()) ||
              null,
            uf:
              (params.address &&
                params.address.uf &&
                params.address.uf.trim()) ||
              null,
            neighborhood:
              (params.address &&
                params.address.neighborhood &&
                params.address.neighborhood.trim()) ||
              null,
            number: (params.address && params.address.number) || null,
            complement:
              (params.address &&
                params.address.complement &&
                params.address.complement.trim()) ||
              null,
          },
          note: (params.note && params.note.trim()) || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorageService.getAccessToken()}`,
          },
        },
      )
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    response = normalizeResponse(data, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};

export const editClient = async (
  params: ClientFormData,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const cep =
      (params.address &&
        params.address.cep &&
        ((typeof params.address.cep === 'string' &&
          params.address.cep.trim().replace(/\D/gi, '')) ||
          params.address.cep)) ||
      null;

    const payload = {
      name: params.name && params.name.trim(),
      email: (params.email && params.email.trim()) || null,
      phone: (params.phone && params.phone.trim()) || null,
      idsegment: params.idsegment,
      address: {
        cep,
        address:
          (params.address &&
            params.address.address &&
            params.address.address.trim()) ||
          null,
        city:
          (params.address &&
            params.address.city &&
            params.address.city.trim()) ||
          null,
        uf:
          (params.address && params.address.uf && params.address.uf.trim()) ||
          null,
        neighborhood:
          (params.address &&
            params.address.neighborhood &&
            params.address.neighborhood.trim()) ||
          null,
        number: (params.address && params.address.number) || null,
        complement:
          (params.address &&
            params.address.complement &&
            params.address.complement.trim()) ||
          null,
      },
      note: (params.note && params.note.trim()) || null,
    };

    const { data, status } = await axios
      .patch(`${API_RV_BASE_URI}/api/client/${params.id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    response = normalizeResponse(data, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};

export const deleteClient = async (
  idclients: number,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .delete(`${API_RV_BASE_URI}/api/client/${idclients}`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({ data: res.data, status: res.status }))
      .catch(err => ({
        data: err.response ? err.response.data : err.response,
        status: err.response ? err.response.status : err.response,
      }));

    response = normalizeResponse(data, status);
  } catch (error) {
    response.error = true;
    response.message = error.message;
  }
  return response;
};
