import React, { useEffect, useState } from "react";
import { SalesService } from "../../service/api/sales/sales";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { SearchButton } from "../../components/buttons/SearchButton";
import { useSelector, useDispatch } from "react-redux";
import { ReduceStore } from "../../app/store";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { ClientService } from "../../service/api/client/client-service";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { TableSales } from "../../components/sales/TableSales";
import { Collapse } from "@mui/material";
import { ColorsBootstrap } from "../../components/modal/GenericModal";
import { GenericButton } from "../../components/buttons/GenericButton";
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

  const [searchFilterDateEnable, setSearchFilterDateEnable] = useState<boolean>(
    false
  );
  const [searchFilterPeriodEnable, setSearchFilterPeriodEnable] = useState<
    boolean
  >(false);
  const [searchFilterClientEnable, setSearchFilterClientEnable] = useState<
    boolean
  >(false);

  const [date, setDate] = useState<string>("");
  const [period, setPeriod] = useState<{ date1: string; date2: string }>({
    date1: "",
    date2: ""
  });
  const [pending, setPending] = useState<boolean>(false);

  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: 0 });

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

  const closeActionButtons = () => {
    setSearchFilterClientEnable(false);
    setSearchFilterPeriodEnable(false);
    setSearchFilterDateEnable(false);
  };

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
        <AlertError title="Não foi possível processar sua requisição." />
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
        <AlertError title="Não foi possível processar sua requisição." />
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
        <AlertError title="Não foi possível processar sua requisição." />
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
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const handleSubmitFilters = async () => {
    if (date) {
      await fetchSalesByDate();
      return true;
    }

    if (period.date1 && period.date2) {
      await fetchSalesByPeriod();
      return true;
    }

    if (clientSelected.idclients) {
      await fetchSalesByClient();
      return true;
    }

    if (pending) {
      await fetchPenging();
      return true;
    }

    setAlert(<AlertInfo title="Preencha os filtros corretamente" />);
    return false;
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

      {alert}

      <TableMultiFilter
        filters={[
          {
            label: "Data",
            value: date,
            placeholder: "",
            type: TypeMultiFilter.date,
            handleChangeValue: (e: any) => setDate(e.target.value)
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
            }
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
              if (item) {
                setClientSelected({
                  label: item.label,
                  idclients: item.value
                });
              } else {
                setClientSelected({ label: "", idclients: null });
              }
            }
          },
          {
            label: "Pendentes",
            value: pending,
            placeholder: "Pendentes",
            type: TypeMultiFilter.check,
            handleChangeValue: () => setPending(!pending)
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
        <h6 className="mt-4 ml-2 font-weight-bold">Faça uma busca</h6>
      )}
    </ContainerMain>
  );
}
