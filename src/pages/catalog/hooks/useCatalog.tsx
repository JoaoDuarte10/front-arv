import { listDeleteHookTemplate } from '../../../hooks/listDeleteHook';
import {
  deleteCatalogs,
  fetchAllCatalogs,
  fetchOneCatalogs,
} from '../../../service/api/catalog/catalog-service';
import { CatalogInterface } from '../../../service/api/catalog/types';

const initialFormData: CatalogInterface[] = [
  {
    idUsers: 0,
    idCatalog: 0,
    name: '',
    description: '',
    price: 0,
    createdAt: '',
    updatedAt: '',
  },
];

const listDeleteParams = {
  initialFormData,
  services: {
    fetchAll: fetchAllCatalogs,
    fetchOne: fetchOneCatalogs,
    delete: deleteCatalogs,
  },
  texts: {
    list: {
      success: 'Pesquisa atualizada',
      error: 'Erro ao buscar informações do serviço',
    },
    delete: {
      success: 'Serviço deletado com sucesso',
      error: 'Erro ao deletar o serviço',
    },
  },
};

export const useHookListDelete = listDeleteHookTemplate<CatalogInterface>(
  listDeleteParams,
);

export const useCatalog = () => {
  const hookData = useHookListDelete();

  return {
    ...hookData,
  };
};
