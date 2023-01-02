import React, { useEffect, useState } from "react";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { ScheduleService, ScheduleInterface } from "../../service/schedule";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { format } from "date-fns";

export function ScheduleHistory(props: { scheduleService: ScheduleService }) {
  const { scheduleService } = props;

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [loader, setLoader] = useState<JSX.Element | null>(null);
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const fetchSchedules = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data, notFound } = await scheduleService.fetchAllHistory();
    setLoader(null);

    if (success) {
      setSchedules(data);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma agenda encontrada." />);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <ContainerMain>
      <Breadcumb
        page={[
          { link: "/schedules", name: "Agendas" },
          { link: false, name: "Histórico" }
        ]}
      />
      <TitlePrincipal title="Histórico de agendas" />

      {loader}

      {schedules.length
        ? schedules.map(schedule => {
            return (
              <div className="schedule_card" key={schedule.idschedules}>
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

                <div className="form-row border-bottom mb-2">
                  <h6 className="text-primary font-weight-bold col">
                    Data:{" "}
                    <small className="text-muted h6">
                      {format(new Date(schedule.date), "dd/MM/yyyy")}
                    </small>
                  </h6>
                  <h6 className="text-primary font-weight-bold col">
                    Horário:{" "}
                    <small className="text-muted h6">{schedule.time}h</small>
                  </h6>
                </div>

                {schedule.pacote ? (
                  <div className="form-row border-bottom mb-2">
                    <h6 className="text-primary font-weight-bold col">
                      Atendimentos:{" "}
                      <small className="text-muted h6">
                        {schedule.totalAtendenceCount}
                      </small>
                    </h6>
                    <h6 className="text-primary font-weight-bold col">
                      Realizados:{" "}
                      <small className="text-muted h6">
                        {schedule.atendenceCount}
                      </small>
                    </h6>
                  </div>
                ) : null}

                <h6 className="text-primary font-weight-bold border-bottom mb-2 pb-2">
                  Criado em:{" "}
                  <small className="text-muted h6">
                    {format(
                      new Date(schedule.createdAt as string),
                      "dd/MM/yyyy 'às' HH:mm'h'"
                    )}
                  </small>
                </h6>
                <h6 className="text-primary font-weight-bold border-bottom mb-2 pb-2">
                  Finalizada em:{" "}
                  <small className="text-muted h6">
                    {format(
                      new Date(schedule.updatedAt as string),
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
