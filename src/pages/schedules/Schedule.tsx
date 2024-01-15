import React from 'react';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ClientService } from '../../service/api/client/client-service';
import { format } from 'date-fns';
import { WhatsAppIconButton } from '../../components/buttons/WhatsAppIconButton';
import { BasicDeleteModal } from '../../components/modal/BasicDeleteModal';
import { FormSchedule } from '../../components/FormSchedule';
import { BasicEditModal } from '../../components/modal/BasicEditModal';
import { WhatsAppService } from '../../service/api/whatsapp/whatsapp';
import { FormSales } from '../sales/FormSales';
import { SalesService } from '../../service/api/sales/sales';
import { DivInline } from '../../components/containers/DivInline';
import {
  ColorsBootstrap,
  GenericModal,
} from '../../components/modal/GenericModal';
import { GenericButton } from '../../components/buttons/GenericButton';
import { LabelForm } from '../../components/labels/LabelForm';
import { LabelSmall } from '../../components/labels/LabelSmal';
import { randomId } from '../../utils/random';
import { OutgoingService } from '../../service/api/outgoing/outgoing';
import { ScheduleService } from '../../service/api/schedule/schedule';
import { ScheduleInterface } from '../../service/api/schedule/types';
import {
  TableMultiFilter,
  TypeMultiFilter,
} from '../../components/tableMultiFilter/index';
import { useSchedule } from './hooks/useSchedule';

export function Schedules(props: {
  clientService: ClientService;
  scheduleService: ScheduleService;
  whatsAppService: WhatsAppService;
  salesService: SalesService;
  outgoingService: OutgoingService;
}) {
  const { clientService, whatsAppService, outgoingService } = props;

  const hookData = useSchedule();

  const {
    alert,
    loader,
    schedules,
    clients,
    openModal,
    openModalSale,
    onChangeSchedule,
    onDelete,
    finish,
    onCreateSale,
    clientSelected,
    setClientSelected,
    date,
    setDate,
    handleSubmitFilters,
    setOpenModal,
    setOpenModalSale,
  } = hookData;

  const filters = [
    {
      label: 'Data',
      value: date,
      placeholder: '',
      type: TypeMultiFilter.date,
      handleChangeValue: setDate,
      disabled: clientSelected.label ? true : false,
    },
    {
      label: 'Clientes',
      value: clientSelected.label,
      placeholder: 'Selecione o cliente',
      type: TypeMultiFilter.select,
      options: clients.map(client => ({
        label: client.name,
        value: client.id,
      })),
      handleChangeValue: (
        e: React.BaseSyntheticEvent,
        item: { label: string; value: number },
      ) => {
        if (item && typeof item === 'object') {
          setClientSelected({
            label: item.label,
            idclients: item.value,
          });
        }
        if (!item) {
          setClientSelected({ label: '', idclients: null });
        }
      },
      disabled: date ? true : false,
    },
  ];

  const clearFilters = () => {
    setDate('');
    setClientSelected({ label: '', idclients: null });
  };

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb
        page={[
          { link: '/create-schedule', name: 'Nova agenda' },
          { link: false, name: 'Suas agendas' },
        ]}
      />
      <TitlePrincipal title="Agendas" />

      <TableMultiFilter
        filters={filters}
        clearFilters={clearFilters}
        handleSubmit={handleSubmitFilters}
      />

      {alert}

      {schedules.length
        ? schedules.map((schedule: ScheduleInterface) => {
            return (
              <div className="schedule_card" key={randomId() + randomId()}>
                {schedule.expired ? (
                  <small className="h6 text-danger font-weight-bold pulse">
                    Horário expirado
                  </small>
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {schedule.phone ? (
                    <WhatsAppIconButton
                      onClick={(e: React.SyntheticEvent) => {
                        whatsAppService.redirectToWhatsappWithMessage({
                          event: e,
                          id: schedule.idschedules as number,
                          client:
                            schedule.clientName || (schedule.name as string),
                          phone: schedule.phone as string,
                          date: schedule.date,
                          time: schedule.time,
                          totalAtendenceCount: schedule.totalAtendenceCount,
                          atendenceCount: schedule.atendenceCount as number,
                          description: schedule.description,
                          services:
                            schedule.scheduleServices &&
                            schedule.scheduleServices.length
                              ? schedule.scheduleServices.map(
                                  scheduleService => scheduleService.name,
                                )
                              : [],
                        });
                      }}
                    />
                  ) : null}

                  <BasicEditModal>
                    <FormSchedule
                      clientService={clientService}
                      alert={alert}
                      edit={true}
                      onChange={onChangeSchedule}
                      schedule={schedule}
                    />
                  </BasicEditModal>

                  <BasicDeleteModal
                    btnName="Excluir"
                    onChange={(e: React.SyntheticEvent) =>
                      onDelete(schedule.idschedules || 0)
                    }
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ color: 'red' }}
                    >
                      Excluir Agenda
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Tem certeza que deseja excluir essa agenda?
                    </Typography>
                  </BasicDeleteModal>
                </div>

                <LabelForm
                  text="Código do agendamento"
                  className="pb-2 border-bottom"
                >
                  <LabelSmall text={schedule.idschedules || ''} />
                </LabelForm>

                <LabelForm text="Cliente" className="pb-2 border-bottom">
                  <LabelSmall
                    text={schedule.name || (schedule.clientName as string)}
                  />
                </LabelForm>
                <LabelForm text="Observação" className="pb-2 border-bottom">
                  <LabelSmall text={schedule.description} />
                </LabelForm>

                {schedule.scheduleServices &&
                schedule.scheduleServices.length > 0 ? (
                  <Grid item xs={12} md={6}>
                    <LabelForm text="Serviços" className="pb-2 border-bottom">
                      <LabelSmall
                        text={schedule.scheduleServices
                          .map(scheduleService => scheduleService.name.trim())
                          .join(', ')}
                      />
                    </LabelForm>
                  </Grid>
                ) : null}

                <DivInline className="row">
                  <LabelForm
                    text="Data"
                    className="col-sm-6 pb-2 border-bottom"
                  >
                    <LabelSmall
                      text={format(
                        new Date(schedule.date.replace('Z', '')),
                        'dd/MM/yyyy',
                      )}
                    />
                  </LabelForm>
                  <LabelForm
                    text="Horário"
                    className="col-sm-6 pb-2 border-bottom"
                  >
                    <LabelSmall
                      text={`${schedule.initialTime || schedule.time}h ${
                        schedule.initialTime !== schedule.endTime
                          ? `à ${schedule.endTime}h`
                          : ''
                      }`}
                    />
                  </LabelForm>
                </DivInline>

                {schedule.pacote ? (
                  <DivInline className="row">
                    <LabelForm
                      text="Atendimentos"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall text={schedule.totalAtendenceCount} />
                    </LabelForm>
                    <LabelForm
                      text="Atual"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall text={schedule.atendenceCount as number} />
                    </LabelForm>
                  </DivInline>
                ) : null}

                <LabelForm text="Criação" className="border-bottom pb-2 mb-2">
                  <LabelSmall
                    text={format(
                      new Date(
                        schedule.createdAt
                          ? schedule.createdAt.replace('Z', '')
                          : (schedule.createdAt as string),
                      ),
                      "dd/MM/yyyy 'às' HH:mm'h'",
                    ).toString()}
                  />
                </LabelForm>

                <DivInline style={{ marginLeft: '2px', marginTop: '15px' }}>
                  <GenericModal
                    btnOpenName="Finalizar"
                    color={ColorsBootstrap.primary}
                    styleModal={{ padding: '20px' }}
                    styleBtn={{ marginRight: '10px' }}
                    openModal={
                      openModal[schedule.idschedules as number] || false
                    }
                    setOpenModal={(value: boolean) =>
                      setOpenModal({
                        ...openModalSale,
                        [schedule.idschedules as number]: value,
                      })
                    }
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ color: '#0275d8' }}
                    >
                      Finalizar agenda
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Tem certeza que deseja finalizar essa agenda?
                    </Typography>
                    <GenericButton
                      color={ColorsBootstrap.primary}
                      onClick={(e: React.BaseSyntheticEvent) =>
                        finish(schedule.idschedules as number)
                      }
                      text="Finalizar"
                      style={{
                        marginTop: '15px',
                      }}
                    />
                  </GenericModal>

                  <GenericModal
                    btnOpenName="Gerar venda"
                    color={ColorsBootstrap.success}
                    openModal={
                      openModalSale[schedule.idschedules as number] || false
                    }
                    setOpenModal={(value: boolean) =>
                      setOpenModalSale({
                        ...openModalSale,
                        [schedule.idschedules as number]: value,
                      })
                    }
                  >
                    <FormSales
                      clients={clients}
                      onChange={onCreateSale}
                      alert={alert}
                      schedule={schedule}
                      outgoingService={outgoingService}
                    />
                  </GenericModal>
                </DivInline>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}
