import { HttpResponse } from "../../service/http/types";
type Services<LT> = {
  fetchAll: () => Promise<HttpResponse<LT[]>>;
  fetchOne: (id: number) => Promise<HttpResponse<LT>>;
  delete: (id: number) => Promise<HttpResponse>;
};

export type Props<LT> = {
  services: Services<LT>;
};
