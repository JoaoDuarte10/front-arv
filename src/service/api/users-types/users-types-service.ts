import axios from 'axios';
import { HttpResponse } from '../../http/types';
import { LocalStorageService } from '../../localStorage/local-storage';
import { UsersTypesFormData, UsersTypesList } from './types';
import { normalizeResponse } from '../../http/fetch';

const API_ARV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

export const createUsersTypes = async (
  params: UsersTypesFormData,
): Promise<HttpResponse<UsersTypesFormData[]>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .post(`${API_ARV_BASE_URI}/api/users-types`, params, {
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

export const updateUsersTypes = async (
  params: UsersTypesFormData,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .patch(`${API_ARV_BASE_URI}/api/users-types/${params.id}`, params, {
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

export const DeleteUsersTypes = async (params: {
  id: number;
}): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .delete(`${API_ARV_BASE_URI}/api/users-types/${params.id}`, {
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

export const getAllUsersTypes = async (): Promise<HttpResponse<
  UsersTypesList[]
>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_ARV_BASE_URI}/api/users-types`, {
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

export const getOneUsersTypes = async (
  params: UsersTypesFormData,
): Promise<HttpResponse<UsersTypesList>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .patch(`${API_ARV_BASE_URI}/api/users-types/${params.id}`, params, {
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
