export type HttpResponse<T = any> = {
  success: boolean;
  data: T;
  unauthorized: boolean;
  error: boolean;
  message: string | null;
  conflict: boolean;
  badRequest: boolean;
  notFound: boolean;
};
