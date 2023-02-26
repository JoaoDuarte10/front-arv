import { HttpResponse } from "../../service/http/types";

export type ListHookProps<LT> = {
  fetchAll: () => Promise<HttpResponse<LT[]>>;
};
