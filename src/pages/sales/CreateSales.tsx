import React from 'react';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { ClientService } from '../../service/api/client/client-service';
import { SalesService } from '../../service/api/sales/sales';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { FormSales } from './FormSales';
import { OutgoingService } from '../../service/api/outgoing/outgoing';
import { useSales } from './hooks/useSales';

export function CreateSales(props: {
  clientService: ClientService;
  salesService: SalesService;
  outgoingService: OutgoingService;
}) {
  const { outgoingService } = props;

  const hookData = useSales();

  const { loader, clients, onCreate, alert } = hookData;

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
