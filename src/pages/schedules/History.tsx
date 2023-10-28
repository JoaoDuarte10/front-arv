import React, { useState } from "react";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { ScheduleService } from "../../service/api/schedule/schedule";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { format } from "date-fns";
import { DivInline } from "../../components/containers/DivInline";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import * as dateFns from "date-fns";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { randomId } from "../../utils/random";
import { ScheduleInterface } from "../../service/api/schedule/types";

export function ScheduleHistory(props: { scheduleService: ScheduleService }) {
  const { scheduleService } = props;

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const fetchSfetchMostRecentFromchedules = async (date: Date) => {
    setLoader(true);
    const {
      success,
      data,
      notFound
    } = await scheduleService.fetchMostRecentFrom(date);
    setLoader(false);

    if (success) {
      setSchedules(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma agenda encontrada." />);
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb
        page={[
          { link: "/schedules", name: "Agendas" },
          { link: false, name: "Histórico" }
        ]}
      />
      <TitlePrincipal title="Histórico de agendas" />

      <div className="filter_buttons">
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            const dateFrom = dateFns.subDays(new Date(), 15);
            fetchSfetchMostRecentFromchedules(dateFrom);
          }}
          text="Últimos 15 dias"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            const dateFrom = dateFns.subDays(new Date(), 30);
            fetchSfetchMostRecentFromchedules(dateFrom);
          }}
          text="Últimos 30 dias"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            const dateFrom = dateFns.subDays(new Date(), 60);
            fetchSfetchMostRecentFromchedules(dateFrom);
          }}
          text="Últimos 60 dias"
        />
      </div>

      {alert}

      {schedules.length
        ? schedules.map(schedule => {
            return (
              <div
                className="schedule_card"
                key={schedule.idschedules + randomId()}
              >
                {schedule.pacote ? (
                  <h6 className="text-danger font-weight-bold mb-3">Pacote</h6>
                ) : null}
                <h6 className="text-primary font-weight-bold pb-2 border-bottom">
                  Cliente:{" "}
                  <small className="text-muted h6">
                    {schedule.name || schedule.clientName}
                  </small>
                </h6>
                <h6 className="text-primary font-weight-bold pb-2 border-bottom">
                  Descrição:{" "}
                  <small className="text-muted h6">
                    {schedule.description}
                  </small>
                </h6>

                <DivInline className="row">
                  <h6 className="text-primary font-weight-bold col-sm-6 border-bottom mb-2 pb-2">
                    Data:{" "}
                    <small className="text-muted h6">
                      {format(
                        new Date(schedule.date.replace("Z", "")),
                        "dd/MM/yyyy"
                      )}
                    </small>
                  </h6>
                  <h6 className="text-primary font-weight-bold col-sm-6 border-bottom mb-2 pb-2">
                    Horário:{" "}
                    <small className="text-muted h6">{schedule.time}h</small>
                  </h6>
                </DivInline>

                {schedule.pacote ? (
                  <DivInline className="row">
                    <h6 className="text-primary font-weight-bold col-sm-6 border-bottom mb-2 pb-2">
                      Atendimentos:{" "}
                      <small className="text-muted h6">
                        {schedule.totalAtendenceCount}
                      </small>
                    </h6>
                    <h6 className="text-primary font-weight-bold col-sm-6 border-bottom mb-2 pb-2">
                      Realizados:{" "}
                      <small className="text-muted h6">
                        {schedule.atendenceCount}
                      </small>
                    </h6>
                  </DivInline>
                ) : null}

                <h6 className="text-primary font-weight-bold border-bottom mb-2 pb-2">
                  Criada em:{" "}
                  <small className="text-muted h6">
                    {format(
                      new Date(
                        schedule.createdAt
                          ? schedule.createdAt.replace("Z", "")
                          : (schedule.createdAt as string)
                      ),
                      "dd/MM/yyyy 'às' HH:mm'h'"
                    )}
                  </small>
                </h6>
                <h6 className="text-primary font-weight-bold">
                  Finalizada em:{" "}
                  <small className="text-muted h6">
                    {format(
                      new Date(
                        schedule.updatedAt
                          ? schedule.updatedAt.replace("Z", "")
                          : (schedule.updatedAt as string)
                      ),
                      "dd/MM/yyyy 'às' HH:mm'h'"
                    )}
                  </small>
                </h6>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}
