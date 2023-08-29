export type CatalogInterface = {
  idUsers: number;
  idCatalog?: number;
  name: string;
  description: string;
  price: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CatalogFormData = {
  idUsers: number;
  idCatalog?: number;
  name: string;
  description: string;
  price: number | null;
};
