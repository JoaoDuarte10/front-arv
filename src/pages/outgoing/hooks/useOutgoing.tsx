import { outgoingService } from '../../../RoutesApp';
import { createUpdateHookTemplate } from '../../../templates/hooks/createUpdateHook/index';
import { OutgoingInterface } from '../../../service/api/outgoing/types';

const initialFormData: OutgoingInterface = {
  idoutgoing: 0,
  description: '',
  date: '',
  total: 0,
  paymentMethod: null as any,
  installment: false,
  createdAt: '',
  updatedAt: '',
};

export const useOutgoing = () => {
  const hookData = useHook();

  return {
    ...hookData,
  };
};

const useHook = createUpdateHookTemplate({
  services: {
    create: outgoingService.create,
    update: () => null as any,
  },
  validateForm: () => null as any,
  initialFormData,
  texts: {
    create: {
      success: () => ({ title: 'Despesa criada com sucesso' }),
      error: () => ({ title: 'Erro ao criar despesa' }),
    },
    edit: {
      success: () => ({ title: 'Despesa criada com sucesso' }),
      error: () => ({ title: 'Erro ao criar despesa' }),
    },
  },
});
