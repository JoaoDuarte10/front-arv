import { listDeleteHookTemplate } from '../../../hooks/listDeleteHook';
import { fetchAllRules, fetchOneRule } from '../../../service/api/rules/rules';
import { RulesInterface } from '../../../service/api/rules/type';

const initialFormData: RulesInterface[] = [
  {
    id: 0,
    name: '',
    description: '',
    idRules: 0,
    idUsers: 0,
    hasActive: false,
    createdAt: '',
    updatedAt: '',
  },
];

const listDeleteParams = {
  initialFormData,
  services: {
    fetchAll: fetchAllRules,
    fetchOne: fetchOneRule,
    delete: () => null as any,
  },
  texts: {
    list: {
      success: 'Pesquisa atualizada',
      error: 'Erro ao buscar permissões',
    },
    delete: {
      success: 'Permissão deletada com sucesso',
      error: '',
    },
  },
};

export const useHookListDelete = listDeleteHookTemplate<RulesInterface>(
  listDeleteParams,
);

export const useRules = () => {
  const hookData = useHookListDelete();

  return {
    ...hookData,
  };
};
