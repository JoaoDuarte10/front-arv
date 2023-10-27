import axios from "axios";
import { HttpResponse } from "../../http/types";
import { LocalStorageService } from "../../localStorage/local-storage";
import { normalizeResponse } from "../../http/fetch";
import { CatalogFormData, CatalogInterface } from "./types";

export class CatalogService {
  constructor(
    private readonly baseUri: string,
    private readonly localStorageService: LocalStorageService
  ) {}

  getToken(): string {
    const token = this.localStorageService.getAccessToken();
    return token || "";
  }

  async fetchAll(): Promise<HttpResponse<CatalogInterface[]>> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/catalogs/list-all`, {
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

  async fetchOne(id: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .get(`${this.baseUri}/api/catalog/${id}`, {
          headers: {
            Authorization: `Bearer ${this.localStorageService.getAccessToken()}`
          }
        })
        .then(res => ({
          data: {
            ...res.data,
            price: res.data.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })
          },
          status: res.status
        }))
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

  async create(params: CatalogFormData): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/catalog`, params, {
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

  async update(params: CatalogFormData): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .put(`${this.baseUri}/api/catalog`, params, {
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

  async delete(id: number): Promise<HttpResponse> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .delete(`${this.baseUri}/api/catalog`, {
          params: {
            id
          },
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
}

const API_ARV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

export const fetchAllCatalogs = async (): Promise<HttpResponse<CatalogInterface[]>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_ARV_BASE_URI}/api/catalogs/list-all`, {
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

export const fetchOneCatalogs = async (id: number): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_ARV_BASE_URI}/api/catalogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`
        }
      })
      .then(res => ({
        data: {
          ...res.data,
          price: res.data.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          })
        },
        status: res.status
      }))
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

export const createCatalogs = async (
  params: CatalogFormData
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const price = params.price as any;

    const { data, status } = await axios
      .post(
        `${API_ARV_BASE_URI}/api/catalogs`,
        {
          ...params,
          price: parseInt(price.substring(2).replace(/\.|,/g, "")) / 100
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

export const updateCatalogs = async (
  params: CatalogFormData
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const price = params.price as any;

    const { data, status } = await axios
      .put(
        `${API_ARV_BASE_URI}/api/catalogs`,
        {
          ...params,
          price: parseInt(price.substring(2).replace(/\.|,/g, "")) / 100
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

export const deleteCatalogs = async (id: number): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .delete(`${API_ARV_BASE_URI}/api/catalogs`, {
        params: {
          id
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
