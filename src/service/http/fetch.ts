import { HTTP_RESPONSE } from "../../utils/constants";
import { Response } from "./types";

export function normalizeResponse(data: any, status: number): Response {
  const response: Response = {
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
      break;
    case HTTP_RESPONSE.BAD_REQUEST:
      response.badRequest = true;
      break;
    case HTTP_RESPONSE.NOT_FOUND:
      response.notFound = true;
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
