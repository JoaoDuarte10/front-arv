import { TextBuilder, TextValidationBuilder } from '../types';
import { ValidationResult } from '../../../service/validator/types';
import { HttpResponse } from '../../../service/http/types';

type Services = {
  create: (params: any) => Promise<HttpResponse>;
  update: (id: number, params: any) => Promise<any>;
};

export type Props<FD, DT extends FD> = {
  services: Services;
  initialFormData: DT;
  validateForm: (params: FD) => Promise<ValidationResult>;
  texts: {
    create: {
      success: TextBuilder;
      error: TextBuilder;
      validate?: TextValidationBuilder<FD>;
    };
    edit: {
      success: TextBuilder;
      error: TextBuilder;
      validate?: TextValidationBuilder<FD>;
    };
  };
};
