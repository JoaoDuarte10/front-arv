import axios from "axios";
import { HTTP_RESPONSE } from "../utils/constants";

export class LoginService {
  constructor(private readonly baseUri: string) {}

  async signIn(params: { user: string; password: string }): Promise<any> {
    const response = {
      success: false,
      data: null,
      unauthorized: true,
      error: false,
      message: null
    };
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

      if (status === HTTP_RESPONSE.SUCCESS) {
        response.unauthorized = false;
      }

      response.success = true;
      response.data = data;
    } catch (error) {
      response.error = true;
      response.message = error.message;
    }
    return response;
  }
}
