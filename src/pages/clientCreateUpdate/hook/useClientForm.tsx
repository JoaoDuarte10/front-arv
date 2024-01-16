import React, { useEffect } from 'react';
import {
  ClientFormData,
  ClientsInterface,
} from '../../../service/api/client/types';
import { createUpdateHookTemplate } from '../../../hooks/createUpdateHook';
import {
  createClient,
  editClient,
  fetchClientById,
} from '../../../service/api/client/client-service';
import { fetchAddress } from '../../../service/api/cep/cep-service';

const initialFormData: ClientFormData = {
  id: 0,
  name: '',
  email: '',
  phone: '',
  segment: '',
  idsegment: null,
  address: {
    cep: '',
    address: '',
    city: '',
    uf: '',
    neighborhood: '',
    number: 0,
    complement: '',
  },
  note: '',
  cpf: '',
  cnpj: '',
  createdAt: '',
} as any;

const params = {
  initialFormData,
  services: {
    create: createClient,
    edit: editClient,
    getDetails: fetchClientById,
  },
  texts: {
    create: {
      success: 'Cliente criado com sucesso',
      error: 'Erro ao criar o cliente',
    },
    edit: {
      success: 'Cliente editado com sucesso',
      error: 'Erro ao editar o cliente',
    },
    details: {
      success: 'Pesquisa atualizada',
      error: 'Erro ao buscar informações do cliente',
    },
  },
};

export const useHookCreateUpdate = createUpdateHookTemplate<
  ClientFormData,
  ClientFormData
>(params as any);

export const useClientForm = () => {
  const hookData = useHookCreateUpdate();

  const { setLoading, setFormData } = hookData;

  const handleChangeAddress = (field: any) => (value: string | number) => {
    setFormData(state => ({
      ...state,
      address: {
        ...(state.address as any),
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const cep =
      (hookData.formData.address &&
        hookData.formData.address.cep &&
        typeof hookData.formData.address.cep === 'string' &&
        hookData.formData.address.cep.replace(/\D/gi, '')) ||
      '';

    const hasCorrectLength = cep.length === 8;
    if (!hasCorrectLength) {
      return;
    }

    try {
      setLoading(true);
      fetchAddress(cep).then(res => {
        if (res.success) {
          const address = res.data;
          setFormData(state => ({
            ...state,
            address: {
              ...state.address,
              ...(address as any),
            },
          }));
        }
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [
    hookData.formData.address &&
      hookData.formData.address.cep &&
      hookData.formData.address.cep,
  ]);

  return {
    ...hookData,
    handleChangeAddress,
  };
};
