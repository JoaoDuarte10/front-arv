import React, { useEffect, useState } from "react";
import { SalesService } from "../../service/api/sales/sales";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { useSelector, useDispatch } from "react-redux";
import { ReduceStore } from "../../app/store";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { ClientService } from "../../service/api/client/client-service";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { TableSales } from "../../components/sales/TableSales";
import { ClientsInterface } from "../../service/api/client/types";
import { SalesInterface } from "../../service/api/sales/types";
import {
  TableMultiFilter,
  TypeMultiFilter
} from "../../components/tableMultiFilter/index";

export function Sales(props: {
  salesService: SalesService;
  clientService: ClientService;
}) {
  const { clientService, salesService } = props;

  const dispatch = useDispatch();

  const [date, setDate] = useState<string>("");
  const [period, setPeriod] = useState<{ date1: string; date2: string }>({
    date1: "",
    date2: ""
  });
  const [pending, setPending] = useState<boolean>(false);

  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: null });

  const clientsCache = useSelector((state: ReduceStore) => state.client);
  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [sales, setSales] = useState<SalesInterface[]>([]);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

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

  const fetchSalesByDate = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      notFound,
      badRequest
    } = await salesService.findByDate(date);
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="N??o foi poss??vel processar sua requisi????o." />
      );
    }
    if (badRequest) {
      setAlert(<AlertInfo title="pPreencha os campos corretamente." />);
    }
  };

  const fetchSalesByPeriod = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      notFound,
      badRequest
    } = await salesService.findByPeriod(period.date1, period.date2);
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="N??o foi poss??vel processar sua requisi????o." />
      );
    }
    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
  };

  const fetchSalesByClient = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      notFound,
      badRequest
    } = await salesService.findByClient(clientSelected.idclients as number);
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="N??o foi poss??vel processar sua requisi????o." />
      );
    }
    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
  };

  const fetchPenging = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data, error, notFound } = await salesService.findPending();
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="N??o foi poss??vel processar sua requisi????o." />
      );
    }
  };

  const fetchByAllFilters = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      notFound,
      badRequest,
      message
    } = await salesService.fetchByAllFilter({
      idclients: clientSelected.idclients as number,
      date,
      period,
      pending
    });
    setLoader(null);

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
        <AlertError title="N??o foi poss??vel processar sua requisi????o." />
      );
    }
  };

  const handleSubmitFilters = async () => {
    await fetchByAllFilters();
    return true;
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loader}
      <Breadcumb
        page={[
          { link: "/create-sale", name: "Nova venda" },
          { link: false, name: "Suas vendas" }
        ]}
      />
      <TitlePrincipal title="Suas vendas" />

      <TableMultiFilter
        filters={[
          {
            label: "Data",
            value: date,
            placeholder: "",
            type: TypeMultiFilter.date,
            handleChangeValue: setDate,
            disabled: period.date1 || period.date2 ? true : false
          },
          {
            label: "Periodo",
            value: "",
            placeholder: "",
            type: TypeMultiFilter.period,
            handleChangeValue: () => null,
            period: {
              date1: {
                value: period.date1,
                handleChangeValue: (e: React.BaseSyntheticEvent) => 
                setPeriod({ date1: e.target.value, date2: period.date2 })
              },
              date2: {
                value: period.date2,
                handleChangeValue: (e: React.BaseSyntheticEvent) =>
                setPeriod({ date1: period.date1, date2: e.target.value })
              }
            },
            disabled: date ? true : false
          },
          {
            label: "Clientes",
            value: clientSelected.label,
            placeholder: "Selecione o cliente",
            type: TypeMultiFilter.select,
            options: clients.map(client => ({
              label: client.name,
              value: client.idclients
            })),
            handleChangeValue: (
              e: React.BaseSyntheticEvent,
              item: { label: string; value: number }
            ) => {
              if (
                typeof item === "object" &&
                item &&
                item.label &&
                item.value
              ) {
                setClientSelected({
                  label: item.label,
                  idclients: item.value
                });
              }
            },
            disabled: false
          },
          {
            label: "Pendentes",
            value: pending,
            placeholder: "Pendentes",
            type: TypeMultiFilter.check,
            handleChangeValue: () => setPending(!pending),
            disabled: false
          }
        ]}
        clearFilters={(e: React.BaseSyntheticEvent) => {
          setDate("");
          setClientSelected({ label: "", idclients: null });
          setPeriod({ date1: "", date2: "" });
          setPending(false);
        }}
        handleSubmit={handleSubmitFilters}
      />

      {alert}

      {sales.length ? (
        <div>
          <TableSales sales={sales} salesService={salesService} />
          <strong>Quantidade de vendas:</strong>{" "}
          {sales.length > 0 ? sales.length : null}
          <br />
          {sales.length &&
          sales.filter(sale => sale.paymentStatus === "PENDING").length ? (
            <div className="mt-2 mb-2">
              <strong>Total a receber: </strong>{" "}
              {sales.length > 0
                ? salesService.countTotalValueSales(
                    sales
                      .filter(sale => sale.paymentStatus === "PENDING")
                      .map(sale => Number(sale.total))
                  )
                : null}
            </div>
          ) : null}
          <strong>Total recebido:</strong>{" "}
          {sales.length > 0
            ? salesService.countTotalValueSales(
                sales
                  .filter(sale => sale.paymentStatus === "PAID")
                  .map(sale => Number(sale.total))
              )
            : null}
        </div>
      ) : (
        <h6 className="mt-4 ml-2 font-weight-bold">Fa??a uma busca</h6>
      )}
    </ContainerMain>
  );
}
