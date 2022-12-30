import React, { useEffect, useState } from "react";
import { SalesService, SalesInterface } from "../../service/sales";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { SearchButton } from "../../components/buttons/SearchButton";
import { useSelector, useDispatch } from "react-redux";
import { ReduceStore } from "../../app/store";
import { clientAdded } from "../../reducers/clients-slice";
import { ClientsInterface } from "../clients/Clients";
import { ClientService } from "../../service/client-service";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { TableSales } from "../../components/sales/TableSales";

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

  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number;
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
      setAlert(<AlertInfo title="pPreencha os campos corretamente." />);
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
    } = await salesService.findByClient(clientSelected.idclients);
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

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loader}
      <Breadcumb page={[{ link: "sales", name: "Vendas" }]} />
      <TitlePrincipal title="Suas vendas" />

      <div className="filter_buttons">
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterClientEnable(false);
            setSearchFilterPeriodEnable(false);
            setSearchFilterDateEnable(!searchFilterDateEnable);
          }}
          text="Data"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterDateEnable(false);
            setSearchFilterClientEnable(false);
            setSearchFilterPeriodEnable(!searchFilterPeriodEnable);
          }}
          text="Período"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterDateEnable(false);
            setSearchFilterPeriodEnable(false);
            setSearchFilterClientEnable(!searchFilterClientEnable);
          }}
          text="Cliente"
        />
        <ClearSearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setDate("");
            setClientSelected({ label: "", idclients: 0 });
            setPeriod({ date1: "", date2: "" });
          }}
        />
      </div>

      {searchFilterDateEnable ? (
        <div className="filter_buttons">
          <small className="font-weight-bold">Selecione a data</small>
          <div
            style={{
              display: "flex"
            }}
          >
            <FullWidthTextField
              type="date"
              fnChange={(e: React.BaseSyntheticEvent) =>
                setDate(e.target.value)
              }
              label=""
              value={date}
            />
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchSalesByDate()}
              style={{
                margin: "5px 0"
              }}
            />
          </div>
          <button
            className="btn btn-secondary mt-2"
            onClick={e => closeActionButtons()}
          >
            Fechar
          </button>
        </div>
      ) : null}

      {searchFilterPeriodEnable ? (
        <div className="filter_buttons">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "360px",
              alignItems: "flex-end"
            }}
          >
            <div
              style={{
                display: "block"
              }}
            >
              <small className="font-weight-bold">Inicial</small>
              <FullWidthTextField
                type="date"
                fnChange={(e: React.BaseSyntheticEvent) =>
                  setPeriod({ date1: e.target.value, date2: period.date2 })
                }
                label=""
                value={period.date1}
              />
            </div>
            <div
              style={{
                display: "block",
                marginLeft: "10px"
              }}
            >
              <small className="font-weight-bold">Final</small>

              <FullWidthTextField
                type="date"
                fnChange={(e: React.BaseSyntheticEvent) =>
                  setPeriod({ date1: period.date1, date2: e.target.value })
                }
                label=""
                value={period.date2}
              />
            </div>
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchSalesByPeriod()}
              style={{
                height: "55px",
                marginBottom: "5px"
              }}
            />
          </div>
          <button
            className="btn btn-secondary mt-2"
            onClick={e => closeActionButtons()}
          >
            Fechar
          </button>
        </div>
      ) : null}

      {searchFilterClientEnable ? (
        <div className="filter_buttons">
          <div
            style={{
              display: "flex"
            }}
          >
            <ComboBoxList
              label="Selecione o cliente"
              options={clients.map(item => {
                return {
                  label: item.name,
                  idclients: item.idclients
                };
              })}
              onChange={(
                e: React.BaseSyntheticEvent,
                item: { label: string; idclients: number }
              ) => {
                if (item) {
                  setClientSelected({
                    label: item.label,
                    idclients: item.idclients
                  });
                } else {
                  setClientSelected({ label: "", idclients: 0 });
                }
              }}
              style={{
                width: "300px",
                margin: "5px 0"
              }}
              value={clientSelected.label}
            />
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchSalesByClient()}
              style={{
                margin: "5px 0"
              }}
            />
          </div>
          <button
            className="btn btn-secondary mt-2"
            onClick={e => closeActionButtons()}
          >
            Fechar
          </button>
        </div>
      ) : null}

      {alert}

      {sales.length ? (
        <div>
          <TableSales sales={sales} salesService={salesService} />
          <div className="inline">
            <p>
              <strong>Quantidade de vendas:</strong>{" "}
              {sales.length > 0 ? sales.length : null}
            </p>
          </div>
          {sales.length &&
          sales.filter(sale => sale.payment_status === "PENDING").length ? (
            <div className="form-row mt-2">
              <h6 className="font-weight-bold">Total a receber: </h6>
              <h6>
                {sales.length > 0
                  ? salesService.countTotalValueSales(
                      sales
                        .filter(sale => sale.payment_status === "PENDING")
                        .map(sale => Number(sale.total))
                    )
                  : null}
              </h6>
            </div>
          ) : null}
          <div className="form-row mt-2">
            <h6 className="font-weight-bold">Total recebido:</h6>
            <h6>
              {sales.length > 0
                ? salesService.countTotalValueSales(
                    sales
                      .filter(sale => sale.payment_status === "PAID")
                      .map(sale => Number(sale.total))
                  )
                : null}
            </h6>
          </div>
        </div>
      ) : (
        <h6 className="mt-4 ml-2 font-weight-bold">Faça uma busca</h6>
      )}
    </ContainerMain>
  );
}