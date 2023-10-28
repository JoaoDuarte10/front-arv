import { MapObject } from '../../types/mapObjects';

export type Validator = (
  value: any,
  context?: any,
) => (string | null) | Promise<string | null>;

export type ValidationResult = {
  isValid: boolean;
  errors: string | null;
};

export type ValidationSchema = MapObject<Validator>;
