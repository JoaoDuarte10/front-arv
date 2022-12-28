import axios from "axios";
import { Response, normalizeResponse } from "./fetch";

export class LoginService {
  constructor(private readonly baseUri: string) {}

  async signIn(params: { user: string; password: string }): Promise<any> {
    let response: Response = {} as Response;
    try {
      const { data, status } = await axios
        .post(`${this.baseUri}/api/users/login`, {
          username: params.user,
          password: params.password
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
