import React, { useState } from "react";
import { OutgoingService, OutgoingInterface } from "../../service/outgoing";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { TIMEOUT } from "../../utils/constants";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertError } from "../../components/alerts/AlertError";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import { Collapse } from "@mui/material";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { SearchButton } from "../../components/buttons/SearchButton";
import { TableOutgoing } from "../../components/outgoing/TableOutgoing";
import { countTotalValues } from "../../utils/sum";

export function Outgoing(props: { outgoingService: OutgoingService }) {
  const { outgoingService } = props;

  const [outgoing, setOutgoing] = useState<OutgoingInterface[]>([]);

  const [date, setDate] = useState<string>("");
  const [period, setPeriod] = useState<{ date1: string; date2: string }>({
    date1: "",
    date2: ""
  });

  const [searchFilterDateEnable, setSearchFilterDateEnable] = useState<boolean>(
    false
  );
  const [searchFilterPeriodEnable, setSearchFilterPeriodEnable] = useState<
    boolean
  >(false);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const fetchAll = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data, notFound, error } = await outgoingService.fetchAll();
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma despesa encontrada" />);
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
  };

  const fetchByDate = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      notFound,
      error
    } = await outgoingService.fetchByDate(date as any);
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma despesa encontrada" />);
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
  };

  const fetchByPeriod = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      notFound,
      error
    } = await outgoingService.fetchByPeriod(
      period.date1 as any,
      period.date2 as any
    );
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma despesa encontrada" />);
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
  };

  const closeActionButtons = () => {
    setSearchFilterPeriodEnable(false);
    setSearchFilterDateEnable(false);
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loader}
      <Breadcumb
        page={[
          { link: "/create-outgoing", name: "Nova despesa" },
          { link: false, name: "Suas despesas" }
        ]}
      />
      <TitlePrincipal title="Despesas" />

      <div className="filter_buttons">
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterPeriodEnable(false);
            setSearchFilterDateEnable(!searchFilterDateEnable);
          }}
          text="Data"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterDateEnable(false);
            setSearchFilterPeriodEnable(!searchFilterPeriodEnable);
          }}
          text="Período"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchAll()}
          text="Todas"
        />
        <ClearSearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setDate("");
            setPeriod({ date1: "", date2: "" });
          }}
        />
      </div>

      <Collapse in={searchFilterDateEnable} timeout="auto" unmountOnExit>
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
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "10px"
            }}
          >
            <button
              className="btn btn-secondary font-weight-bold"
              onClick={e => closeActionButtons()}
            >
              Fechar
            </button>
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchByDate()}
            />
          </div>
        </div>
      </Collapse>

      <Collapse in={searchFilterPeriodEnable} timeout="auto" unmountOnExit>
        <div className="filter_buttons">
          <div
            className="form-row"
            style={{
              maxWidth: "380px"
            }}
          >
            <div className="col">
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
            <div className="col">
              <small className="font-weight-bold">Final</small>
              <div className="">
                <FullWidthTextField
                  type="date"
                  fnChange={(e: React.BaseSyntheticEvent) =>
                    setPeriod({ date1: period.date1, date2: e.target.value })
                  }
                  label=""
                  value={period.date2}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "10px"
            }}
          >
            <button
              className="btn btn-secondary font-weight-bold"
              onClick={e => closeActionButtons()}
            >
              Fechar
            </button>
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchByPeriod()}
            />
          </div>
        </div>
      </Collapse>

      {alert}

      {outgoing.length ? (
        <div>
          <TableOutgoing
            outgoings={outgoing}
            outgoingService={outgoingService}
          />
          <strong>Total:</strong>{" "}
          {countTotalValues(outgoing.map(item => Number(item.total)))}
        </div>
      ) : null}
    </ContainerMain>
  );
}
