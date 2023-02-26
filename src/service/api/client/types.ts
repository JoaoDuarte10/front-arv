export type ClientsInterface = {
  idclients: number;
  name: string;
  email: string;
  phone: string;
  segment: string;
  address: string;
  addressNumber: number;
  note: string;
  created_at: string;
  updated_at?: string;
};

export type ClientFormData = {
  idclients?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: number;
  note: string | null;
  idsegment?: number | null;
  segment?: string;
};
