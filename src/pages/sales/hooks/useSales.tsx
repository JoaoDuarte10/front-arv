import React, { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { ClientsInterface } from '../../../service/api/client/types';
import { clearClient, clientAdded } from '../../../reducers/clients-slice';
import { SalesInterface } from '../../../service/api/sales/types';
import { AlertSuccess } from '../../../components/alerts/AlertSuccess';
import { AlertInfo } from '../../../components/alerts/AlertInfo';
import { ReduceStore } from '../../../app/store';
import { AlertError } from '../../../components/alerts/AlertError';
import { ClientService } from '../../../service/api/client/client-service';
import { SalesService } from '../../../service/api/sales/sales';
import { API_RV_BASE_URI, localStorageService } from '../../../RoutesApp';
import { TIMEOUT } from '../../../utils/constants';
import { OutgoingPaymentMethodEnums } from '../../../service/api/outgoing/types';

export const useSales = () => {
  const dispatch = useDispatch();

  const clientService = new ClientService(API_RV_BASE_URI, localStorageService);
  const salesService = new SalesService(API_RV_BASE_URI, localStorageService);

  const [loader, setLoader] = useState<boolean>(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [sales, setSales] = useState<SalesInterface[]>([]);

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const getAllClients = async () => {
    setLoader(true);
    const { data } = await clientService.fetchAllClients();
    setLoader(false);

    if (data) {
      dispatch(clearClient());
      setClients(data);
      dispatch(clientAdded(data));
    }
  };

  const fetchByAllFilters = async (params: {
    idclients: number;
    date: string;
    period: { date1: string; date2: string };
    pending: boolean;
  }) => {
    const { idclients, date, period, pending } = params;
    setLoader(true);
    const {
      success,
      data,
      error,
      notFound,
      badRequest,
      message,
    } = await salesService.fetchByAllFilter({
      idclients,
      date,
      period,
      pending,
    });
    setLoader(false);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (badRequest) {
      setAlert(<AlertInfo title={message as string} />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }

    return true;
  };

  const onCreate = async (params: {
    idclients: number;
    clientName: string;
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
    paymentMethod: OutgoingPaymentMethodEnums;
  }): Promise<boolean> => {
    setLoader(true);
    const { success, error, badRequest } = await salesService.create({
      idclients: params.idclients || null,
      clientName: params.clientName || null,
      description: params.description,
      date: params.date,
      total: params.total,
      paymentPending: params.paymentPending,
      paymentDate: params.paymentDate,
      paymentMethod: params.paymentMethod,
    });
    setLoader(false);

    if (success) {
      setAlert(<AlertSuccess title="Venda criada com sucesso." />);
      return true;
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
    return false;
  };

  useEffect(() => {
    if (!clientsCache.length) {
      getAllClients();
    } else {
      setClients(clientsCache);
    }
  }, []);

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return {
    loader,
    alert,
    clients,
    sales,
    fetchByAllFilters,
    onCreate,
  };
};
