import { MapObject } from "../../types/mapObjects";
export type Validator = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) => (string | null) | Promise<string | null>;

export type ValidationResult = {
  isValid: boolean;
  errors: string | null;
};

export type ValidationSchema = MapObject<Validator>;
