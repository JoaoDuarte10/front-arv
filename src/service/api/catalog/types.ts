export type CatalogInterface = {
  idUsers: number;
  idCatalog?: number;
  name: string;
  description: string;
  price: number | null;
  duration: string;
  createdAt: string;
  updatedAt: string;
};

export type CatalogFormData = {
  idUsers: number;
  idCatalog?: number;
  name: string;
  description: string;
  price: number | null;
  duration: string;
};
