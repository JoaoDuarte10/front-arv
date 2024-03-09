import axios from 'axios';
import { HttpResponse } from '../../http/types';
import { LocalStorageService } from '../../localStorage/local-storage';
import { RuleFormData, RulesInterface } from './type';
import { normalizeResponse } from '../../http/fetch';

export enum RulesEnum {
  CLIENTS = 'clients',
}

export class RulesService {
  private rules: string[] = [];

  constructor(private readonly localStorageService: LocalStorageService) {
    const userRules = localStorageService.getRules();
    if (userRules) this.rules = userRules;
  }

  userHasPermission(rule: RulesEnum | string) {
    return this.rules.includes(rule);
  }

  ruleWithPage(page: string): string {
    switch (page) {
      case 'schedule':
      case 'schedules':
        return 'schedule';
      case 'clients':
        return 'clients';
      case 'sales':
        return 'sales';
      case 'outgoing':
        return 'outgoing';
      case 'catalogs':
        return 'catalogs';
      case 'management':
        return 'admin';
      default:
        return '';
    }
  }
}

const API_ARV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

export const fetchAllRules = async (): Promise<HttpResponse<
  RulesInterface[]
>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_ARV_BASE_URI}/api/rules`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({ data: res.data.results, status: res.status }))
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

export const fetchOneRule = async (
  id: number,
): Promise<HttpResponse<RulesInterface>> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .get(`${API_ARV_BASE_URI}/api/rules/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorageService.getAccessToken()}`,
        },
      })
      .then(res => ({
        data: res.data.results,
        status: res.status,
      }))
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

export const createRule = async (
  params: RuleFormData,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .post(`${API_ARV_BASE_URI}/api/rules`, params, {
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

export const updateRules = async (
  params: RuleFormData,
): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .patch(`${API_ARV_BASE_URI}/api/rules/${params.id}`, params, {
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

export const enableRule = async (params: {
  idRules: number;
}): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .post(`${API_ARV_BASE_URI}/api/rules/enable`, params, {
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

export const disableRule = async (params: {
  idRules: number;
}): Promise<HttpResponse> => {
  let response: HttpResponse = {} as HttpResponse;
  try {
    const { data, status } = await axios
      .post(`${API_ARV_BASE_URI}/api/rules/disable`, params, {
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
