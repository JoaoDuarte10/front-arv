import React, { useState } from "react";
import { OutgoingService } from "../../service/api/outgoing/outgoing";
import { OutgoingInterface } from "../../service/api/outgoing/types";
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
import {
  TableMultiFilter,
  TypeMultiFilter
} from "../../components/tableMultiFilter/index";

export function Outgoing(props: { outgoingService: OutgoingService }) {
  const { outgoingService } = props;

  const [outgoing, setOutgoing] = useState<OutgoingInterface[]>([]);

  const [date, setDate] = useState<string>("");
  const [period, setPeriod] = useState<{ date1: string; date2: string }>({
    date1: "",
    date2: ""
  });

  const [allOutgoingFilter, setAllOutgoingFilter] = useState<boolean>(false);

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
    const {
      success,
      data,
      notFound,
      error,
      badRequest
    } = await outgoingService.fetchAll();
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma despesa encontrada" />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente" />);
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
      error,
      badRequest
    } = await outgoingService.fetchByDate(date as any);
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente" />);
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
      error,
      badRequest
    } = await outgoingService.fetchByPeriod(
      period.date1 as any,
      period.date2 as any
    );
    setLoader(null);

    if (success) {
      setOutgoing(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente" />);
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

  const handleSubmitFilters = async () => {
    if (date) {
      await fetchByDate();
      return true;
    }

    if (period.date1 && period.date2) {
      await fetchByPeriod();
      return true;
    }

    if (allOutgoingFilter) {
      await fetchAll();
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
          { link: "/create-outgoing", name: "Nova despesa" },
          { link: false, name: "Suas despesas" }
        ]}
      />
      <TitlePrincipal title="Despesas" />

      {alert}

      <TableMultiFilter
        filters={[
          {
            label: "Data",
            value: date,
            placeholder: "",
            type: TypeMultiFilter.date,
            handleChangeValue: (e: any) => setDate(e.target.value),
            disabled: period.date1 || period.date2 || allOutgoingFilter ? true : false
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
            disabled: date || allOutgoingFilter ? true : false
          },
          {
            label: "Todas as despesas",
            value: allOutgoingFilter,
            placeholder: "",
            type: TypeMultiFilter.check,
            handleChangeValue: () => setAllOutgoingFilter(!allOutgoingFilter),
            disabled: date || period.date1 || period.date2 ? true : false
          }
        ]}
        clearFilters={(e: React.BaseSyntheticEvent) => {
          setDate("");
          setPeriod({ date1: "", date2: "" });
          setAllOutgoingFilter(false);
        }}
        handleSubmit={handleSubmitFilters}
      />

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
