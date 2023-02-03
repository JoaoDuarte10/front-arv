import { ValidationResult } from "../../service/validator/types";

export type TextBuilder = (
  error?: any
) => {
  title: string;
  description?: string;
};

export type TextValidationBuilder<FD> = (
  formData: FD,
  error: ValidationResult
) => {
  title: string;
  description?: string;
};

export type Id = { id: string };
