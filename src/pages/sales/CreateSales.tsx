import React, { useEffect, useState } from 'react';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { ClientService } from '../../service/api/client/client-service';
import { ClientsInterface } from '../../service/api/client/types';
import { useDispatch, useSelector } from 'react-redux';
import { clearClient, clientAdded } from '../../reducers/clients-slice';
import { ReduceStore } from '../../app/store';
import { TIMEOUT } from '../../utils/constants';
import { SalesService } from '../../service/api/sales/sales';
import { AlertError } from '../../components/alerts/AlertError';
import { AlertSuccess } from '../../components/alerts/AlertSuccess';
import { AlertInfo } from '../../components/alerts/AlertInfo';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { FormSales } from './FormSales';
import { OutgoingService } from '../../service/api/outgoing/outgoing';
import { OutgoingPaymentMethodEnums } from '../../service/api/outgoing/types';

export function CreateSales(props: {
  clientService: ClientService;
  salesService: SalesService;
  outgoingService: OutgoingService;
}) {
  const { clientService, salesService, outgoingService } = props;
  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

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

  useEffect(() => {
    if (!clientsCache.length) {
      getAllClients();
    } else {
      setClients(clientsCache);
    }
  }, []);

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

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb
        page={[
          { link: '/sales', name: 'Vendas' },
          { link: false, name: 'Nova venda' },
        ]}
      />
      <TitlePrincipal title="Nova venda" />

      <FormSales
        clients={clients}
        onChange={onCreate}
        alert={alert}
        outgoingService={outgoingService}
      />
    </ContainerMain>
  );
}
