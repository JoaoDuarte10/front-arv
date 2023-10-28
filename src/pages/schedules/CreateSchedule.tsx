import React from 'react';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { ClientService } from '../../service/api/client/client-service';
import { ScheduleService } from '../../service/api/schedule/schedule';
import { FormSchedule } from '../../components/FormSchedule';
import { useSchedule } from './hooks/useSchedule';

export function CreateSchedule(props: {
  clientService: ClientService;
  scheduleService: ScheduleService;
}) {
  const { clientService } = props;

  const hookData = useSchedule();

  const { alert, loader, onCreate } = hookData;

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
