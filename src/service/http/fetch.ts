import { HTTP_RESPONSE } from "../../utils/constants";
import { HttpResponse } from "./types";

export function normalizeResponse(data: any, status: number): HttpResponse {
  const response: HttpResponse = {
    success: false,
    data: null,
    unauthorized: false,
    error: false,
    message: null,
    conflict: false,
    badRequest: false,
    notFound: false
  };

  switch (status) {
    case HTTP_RESPONSE.SUCCESS:
    case HTTP_RESPONSE.CREATED:
      response.success = true;
      break;
    case HTTP_RESPONSE.CONFLICT:
      response.conflict = true;
      response.message = data.message || "";
      break;
    case HTTP_RESPONSE.BAD_REQUEST:
      response.badRequest = true;
      response.message = data.message || "";
      break;
    case HTTP_RESPONSE.NOT_FOUND:
      response.notFound = true;
      response.message = data.message || "";
      break;
    case HTTP_RESPONSE.UNAUTHORIZED:
      response.unauthorized = true;
      break;
    case HTTP_RESPONSE.ERROR:
    case undefined:
      response.error = true;
      break;
    default:
      break;
  }

  response.data = data;

  return response;
}
