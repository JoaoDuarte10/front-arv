export type ClientsInterface = {
  id: number;
  name: string;
  email: string;
  phone: string;
  segment: string;
  address: AddressDto;
  note: string;
  createdAt: string;
  updatedAt?: string;
};

export type AddressDto = {
  cep: string;
  address: string;
  city: string;
  uf: string;
  neighborhood: string;
  number: number;
  complement: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientFormData = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: AddressDto;
  note: string | null;
  idsegment?: number | null;
  segment?: string;
};
