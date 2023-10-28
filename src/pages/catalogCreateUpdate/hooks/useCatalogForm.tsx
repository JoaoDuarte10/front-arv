import { createUpdateHookTemplate } from '../../../hooks/createUpdateHook';
import {
  createCatalogs,
  fetchOneCatalogs,
  updateCatalogs,
} from '../../../service/api/catalog/catalog-service';
import {
  CatalogFormData,
  CatalogInterface,
} from '../../../service/api/catalog/types';

const initialFormData: CatalogInterface & CatalogFormData = {
  idUsers: 0,
  name: '',
  description: '',
  price: null,
  idCatalog: 0,
  createdAt: '',
  updatedAt: '',
};

const params = {
  initialFormData,
  services: {
    create: createCatalogs,
    edit: updateCatalogs,
    getDetails: fetchOneCatalogs,
  },
  texts: {
    create: {
      success: 'Serviço criado com sucesso',
      error: 'Erro ao criar o serviço',
    },
    edit: {
      success: 'Serviço editado com sucesso',
      error: 'Erro ao editar o serviço',
    },
    details: {
      success: 'Pesquisa atualizada',
      error: 'Erro ao buscar informações do serviço',
    },
  },
};

export const useHookCreateUpdate = createUpdateHookTemplate<
  CatalogFormData,
  CatalogInterface
>(params);

export const useCatalogForm = () => {
  const hookData = useHookCreateUpdate();

  return {
    ...hookData,
  };
};
