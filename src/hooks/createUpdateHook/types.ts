import { HttpResponse } from "../../service/http/types";

export type Services<FD, DT extends FD> = {
  create: (data: FD) => Promise<HttpResponse>;
  edit: (data: FD) => Promise<HttpResponse>;
  getDetails: (id: number) => Promise<HttpResponse<DT>>;
};

export type CreateUpdateProps<FD, DT extends FD> = {
  initialFormData: DT;
  services: Services<FD, DT>;
  texts: {
    create: {
      success: string;
      error: string;
    };
    edit: {
      success: string;
      error: string;
    };
    details: {
      success: string;
      error: string;
    };
  };
};
