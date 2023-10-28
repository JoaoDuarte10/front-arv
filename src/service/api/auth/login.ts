import axios from 'axios';
import { normalizeResponse } from '../../http/fetch';
import { HttpResponse } from '../../http/types';
import { SignIn } from './types';

export class LoginService {
  constructor(private readonly baseUri: string) {}

  async signIn(params: SignIn): Promise<any> {
    let response: HttpResponse = {} as HttpResponse;
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/users/login`, {
          username: params.user.trim(),
          password: params.password,
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
