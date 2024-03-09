import React, { useState } from 'react';
import { SalesService } from '../../service/api/sales/sales';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { useDispatch } from 'react-redux';
import { ClientService } from '../../service/api/client/client-service';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { TableSales } from '../../components/sales/TableSales';
import {
  MultFilter,
  TableMultiFilter,
  TypeMultiFilter,
} from '../../components/tableMultiFilter/index';
import { useSales } from './hooks/useSales';

export function Sales(props: {
  salesService: SalesService;
  clientService: ClientService;
}) {
  const { salesService } = props;

  const hookData = useSales();

  const {
    loader,
    alert,
    clients,
    sales,
    fetchByAllFilters,
    moduleClientEnabled,
  } = hookData;

  const [date, setDate] = useState<string>('');
  const [period, setPeriod] = useState<{ date1: string; date2: string }>({
    date1: '',
    date2: '',
  });
  const [pending, setPending] = useState<boolean>(false);

  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: '', idclients: null });

  const filters: MultFilter[] = [
    {
      label: 'Data',
      value: date,
      placeholder: '',
      type: TypeMultiFilter.date,
      handleChangeValue: setDate,
      disabled: period.date1 || period.date2 ? true : false,
    },
    {
      label: 'Periodo',
      value: '',
      placeholder: '',
      type: TypeMultiFilter.period,
      handleChangeValue: () => null,
      period: {
        date1: {
          value: period.date1,
          handleChangeValue: (e: React.BaseSyntheticEvent) =>
            setPeriod({ date1: e.target.value, date2: period.date2 }),
        },
        date2: {
          value: period.date2,
          handleChangeValue: (e: React.BaseSyntheticEvent) =>
            setPeriod({ date1: period.date1, date2: e.target.value }),
        },
      },
      disabled: date ? true : false,
    },
    {
      label: 'Clientes',
      value: clientSelected.label,
      placeholder: 'Selecione o cliente',
      type: TypeMultiFilter.select,
      options:
        (clients &&
          clients.length &&
          clients.map(client => ({
            label: client.name,
            value: client.id,
          }))) ||
        [],
      handleChangeValue: (
        e: React.BaseSyntheticEvent,
        item: { label: string; value: number },
      ) => {
        if (typeof item === 'object' && item && item.label && item.value) {
          setClientSelected({
            label: item.label,
            idclients: item.value,
          });
        }
      },
      disabled: false,
      isHidden: moduleClientEnabled || !clients.length,
    },
    {
      label: 'Pendentes',
      value: pending,
      placeholder: 'Pendentes',
      type: TypeMultiFilter.check,
      handleChangeValue: () => setPending(!pending),
      disabled: false,
    },
  ];

  const clearFilters = () => {
    setDate('');
    setClientSelected({ label: '', idclients: null });
    setPeriod({ date1: '', date2: '' });
    setPending(false);
  };

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb
        page={[
          { link: '/create-sale', name: 'Nova venda' },
          { link: false, name: 'Suas vendas' },
        ]}
      />
      <TitlePrincipal title="Suas vendas" />

      <TableMultiFilter
        filters={filters}
        clearFilters={clearFilters}
        handleSubmit={() =>
          fetchByAllFilters({
            idclients: clientSelected.idclients as number,
            date,
            period,
            pending,
          })
        }
      />

      {alert}

      {sales.length ? (
        <div>
          <TableSales sales={sales} salesService={salesService} />
          <strong>Quantidade de vendas:</strong>{' '}
          {sales.length > 0 ? sales.length : null}
          <br />
          {sales.length &&
          sales.filter(sale => sale.paymentStatus === 'PENDING').length ? (
            <div className="mt-2 mb-2">
              <strong>Total a receber: </strong>{' '}
              {sales.length > 0
                ? salesService.countTotalValueSales(
                    sales
                      .filter(sale => sale.paymentStatus === 'PENDING')
                      .map(sale => Number(sale.total)),
                  )
                : null}
            </div>
          ) : null}
          <strong>Total recebido:</strong>{' '}
          {sales.length > 0
            ? salesService.countTotalValueSales(
                sales
                  .filter(sale => sale.paymentStatus === 'PAID')
                  .map(sale => Number(sale.total)),
              )
            : null}
        </div>
      ) : null}
    </ContainerMain>
  );
}
