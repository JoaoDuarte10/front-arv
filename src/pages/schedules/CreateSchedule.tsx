import React, { useState } from 'react';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { ClientService } from '../../service/api/client/client-service';
import { AlertSuccess } from '../../components/alerts/AlertSuccess';
import { TIMEOUT } from '../../utils/constants';
import { ScheduleService } from '../../service/api/schedule/schedule';
import { AlertError } from '../../components/alerts/AlertError';
import { AlertInfo } from '../../components/alerts/AlertInfo';
import { FormSchedule } from '../../components/FormSchedule';
import { CatalogService } from '../../service/api/catalog/catalog-service';

export function CreateSchedule(props: {
  clientService: ClientService;
  scheduleService: ScheduleService;
}) {
  const { clientService, scheduleService } = props;

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const onCreate = async (params: {
    idclients: number;
    clientName: string;
    description: string;
    time: string;
    date: string;
    pacote: boolean;
    totalAtendenceCount: number;
    status: string;
    idCatalogs: number[];
  }): Promise<boolean> => {
    setLoader(true);
    const { success, error, badRequest } = await scheduleService.create({
      idclients: params.idclients,
      clientName: params.clientName,
      description: params.description,
      time: params.time,
      date: params.date,
      pacote: params.pacote,
      totalAtendenceCount: params.totalAtendenceCount,
      status: params.status,
      idCatalogs: params.idCatalogs,
    });
    setLoader(false);

    if (success) {
      setAlert(<AlertSuccess title="Agenda criada com sucesso." />);
      return true;
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }

    return false;
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb
        page={[
          { link: '/schedules', name: 'Agendas' },
          { link: false, name: 'Nova agenda' },
        ]}
      />
      <TitlePrincipal title="Nova agenda" />

      <FormSchedule
        clientService={clientService}
        alert={alert}
        edit={false}
        onChange={onCreate}
      />
    </ContainerMain>
  );
}
