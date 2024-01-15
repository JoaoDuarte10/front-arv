import React, { useState } from 'react';
import { ClientsInterface } from '../../../service/api/client/types';
import { listDeleteHookTemplate } from '../../../hooks/listDeleteHook';
import {
  fetchAllClients,
  fetchClientById,
  deleteClient,
} from '../../../service/api/client/client-service';
import { SalesInterface } from '../../../service/api/sales/types';
import {
  findSalesByClient,
  findSalesPendingByClient,
} from '../../../service/api/sales/sales';
import { AlertInfo } from '../../../components/alerts/AlertInfo';
import { AlertError } from '../../../components/alerts/AlertError';
import { AlertSuccess } from '../../../components/alerts/AlertSuccess';

const initialFormData: ClientsInterface[] = [
  {
    id: 0,
    name: '',
    email: '',
    phone: '',
    segment: '',
    address: {
      cep: '',
      address: '',
      city: '',
      uf: '',
      neighborhood: '',
      number: 0,
      complement: '',
      createdAt: '' as any,
      updatedAt: '' as any,
    },
    note: '',
    createdAt: '',
  },
];

const listDeleteParams = {
  initialFormData,
  services: {
    fetchAll: fetchAllClients,
    fetchOne: fetchClientById,
    delete: deleteClient,
  },
  texts: {
    list: {
      success: 'Pesquisa atualizada',
      error: 'Erro ao buscar informações do cliente',
    },
    delete: {
      success: 'Cliente deletado com sucesso',
      error: 'Erro ao deletar o cliente',
    },
  },
};

export const useHookListDelete = listDeleteHookTemplate<ClientsInterface>(
  listDeleteParams,
);

export const useClient = () => {
  const hookData = useHookListDelete();

  const { setLoading, setAlert } = hookData;

  const [sales, setSales] = useState<SalesInterface[]>([]);

  const fetchSalesByClient = async (id: number) => {
    setLoading(true);
    const { success, data, error, notFound } = await findSalesByClient(id);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }
    setLoading(false);
  };

  const fetchSalesPending = async (id: number) => {
    setLoading(true);
    const { success, data, error, notFound } = await findSalesPendingByClient(
      id,
    );

    if (success && data.length) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }

    if (notFound || (data && !data.length)) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }

    setLoading(false);
  };

  return {
    ...hookData,
    fetchSalesByClient,
    fetchSalesPending,
    sales,
    setSales,
  };
};
