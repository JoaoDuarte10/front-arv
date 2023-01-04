import React, { useState } from "react";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { SalesReportsInterface, SalesService } from "../../service/sales";
import * as dateFns from "date-fns";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { randomId } from "../../utils/random";
import { LabelForm } from "../../components/labels/LabelForm";
import { LabelSmall } from "../../components/labels/LabelSmal";

export function SalesReports(props: { salesService: SalesService }) {
  const { salesService } = props;

  const [report, setReport] = useState<SalesReportsInterface | null>(null);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const [findSelected, setFindSelected] = useState<{
    name: string;
    date: string;
  }>({ name: "", date: "" });

  const fetchReportsWithCurrentMonth = async () => {
    const currentMonth = new Date();

    const startDayLastMonth = dateFns.format(
      dateFns.startOfMonth(new Date(currentMonth)),
      "yyyy-MM-dd"
    );
    const endDayLastMonth = dateFns.format(
      dateFns.endOfMonth(new Date(currentMonth)),
      "yyyy-MM-dd"
    );

    setLoader(<CircularIndeterminate />);
    const { success, data, notFound, error } = await salesService.findReports(
      startDayLastMonth,
      endDayLastMonth
    );
    setLoader(null);

    if (success) {
      setReport(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
      setFindSelected({
        name: "Mês atual",
        date: `${startDayLastMonth} à ${endDayLastMonth}`
      });
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhum relatório foi encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const fetchReportsWithLastMonth = async () => {
    const lastMonth = dateFns.subMonths(new Date(), 1).toISOString();

    const startDayLastMonth = dateFns.format(
      dateFns.startOfMonth(new Date(lastMonth)),
      "yyyy-MM-dd"
    );
    const endDayLastMonth = dateFns.format(
      dateFns.endOfMonth(new Date(lastMonth)),
      "yyyy-MM-dd"
    );

    setLoader(<CircularIndeterminate />);
    const { success, data, notFound, error } = await salesService.findReports(
      startDayLastMonth,
      endDayLastMonth
    );
    setLoader(null);

    if (success) {
      setReport(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
      setFindSelected({
        name: "Último mês",
        date: `${startDayLastMonth} - ${endDayLastMonth}`
      });
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhum relatório foi encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const fetchReportCurrentWeek = async () => {
    const currentWeek = new Date();
    const startDateWeek = dateFns.format(
      dateFns.startOfWeek(currentWeek),
      "yyyy-MM-dd"
    );
    const endDateWeek = dateFns.format(
      dateFns.endOfWeek(currentWeek),
      "yyyy-MM-dd"
    );

    setLoader(<CircularIndeterminate />);
    const { success, data, notFound, error } = await salesService.findReports(
      startDateWeek,
      endDateWeek
    );
    setLoader(null);

    if (success) {
      setReport(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
      setFindSelected({
        name: "Semana atual",
        date: `${startDateWeek} - ${endDateWeek}`
      });
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhum relatório foi encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const fetchReportLastWeek = async () => {
    const lastWeek = dateFns.subWeeks(new Date(), 1);
    const startDateWeek = dateFns.format(
      dateFns.startOfWeek(new Date(lastWeek)),
      "yyyy-MM-dd"
    );
    const endDateWeek = dateFns.format(
      dateFns.endOfWeek(lastWeek),
      "yyyy-MM-dd"
    );

    setLoader(<CircularIndeterminate />);
    const { success, data, notFound, error } = await salesService.findReports(
      startDateWeek,
      endDateWeek
    );
    setLoader(null);

    if (success) {
      setReport(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
      setFindSelected({
        name: "Última semana",
        date: `${startDateWeek} - ${endDateWeek}`
      });
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhum relatório foi encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <Breadcumb
        page={[
          { link: "/sales", name: "Suas vendas" },
          { link: false, name: "Relatório" }
        ]}
      />
      <TitlePrincipal title="Relatório de vendas" />

      {loader}

      <div className="filter_buttons">
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) =>
            fetchReportsWithCurrentMonth()
          }
          text="Mês atual"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchReportsWithLastMonth()}
          text="Último mês"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchReportCurrentWeek()}
          text="Semana atual"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchReportLastWeek()}
          text="Última semana"
        />
      </div>

      {alert}

      {findSelected.name ? (
        <LabelForm text={findSelected.name} className="mt-2">
          <LabelSmall text={findSelected.date} />
        </LabelForm>
      ) : null}

      {report ? (
        <div
          key={randomId()}
          style={{
            marginTop: "15px"
            // padding: '5px',
            // backgroundColor: 'green'
          }}
        >
          <div className="group_reports">
            <div className="items_reports">
              <LabelForm text="Total das vendas">
                <LabelSmall
                  text={report.basicInfos.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                />
              </LabelForm>
            </div>
            <div className="items_reports">
              <LabelForm text="Quantidade de vendas">
                <LabelSmall text={report.basicInfos.quantity} />
              </LabelForm>
            </div>
            <div className="items_reports">
              <LabelForm text="Média">
                <LabelSmall
                  text={report.basicInfos.average.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                />
              </LabelForm>
            </div>
            <div className="items_reports">
              <LabelForm text="Clientes atendidos">
                <LabelSmall text={report.basicInfos.countClients} />
              </LabelForm>
            </div>
            <div className="items_reports">
              <h6
                style={{
                  fontWeight: "bold",
                  borderBottom: "1px lightgray solid",
                  paddingBottom: "5px"
                }}
              >
                Maiores vendas
              </h6>
              <LabelForm text="Dia">
                <LabelSmall
                  text={dateFns.format(
                    new Date(report.biggestTotalWithDate.date),
                    "dd/MM/yyyy"
                  )}
                />
              </LabelForm>

              <LabelForm text="Quantidade">
                <LabelSmall text={report.biggestTotalWithDate.countTotal} />
              </LabelForm>

              <LabelForm text="Total">
                <LabelSmall
                  text={report.biggestTotalWithDate.total.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL"
                    }
                  )}
                />
              </LabelForm>
            </div>
            <div className="items_reports">
              <h6
                style={{
                  fontWeight: "bold",
                  borderBottom: "1px lightgray solid",
                  paddingBottom: "5px"
                }}
              >
                Menores vendas
              </h6>
              <LabelForm text="Dia">
                <LabelSmall
                  text={dateFns.format(
                    new Date(report.lowestTotalWithDate.date),
                    "dd/MM/yyyy"
                  )}
                />
              </LabelForm>

              <LabelForm text="Quantidade">
                <LabelSmall text={report.lowestTotalWithDate.countTotal} />
              </LabelForm>

              <LabelForm text="Total">
                <LabelSmall
                  text={report.lowestTotalWithDate.total.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL"
                    }
                  )}
                />
              </LabelForm>
            </div>
          </div>
        </div>
      ) : null}
    </ContainerMain>
  );
}
