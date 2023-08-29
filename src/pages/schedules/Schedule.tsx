import React, { useEffect, useState } from "react";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { Collapse } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SearchButton } from "../../components/buttons/SearchButton";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { ReduceStore } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { ClientService } from "../../service/api/client/client-service";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { TIMEOUT } from "../../utils/constants";
import { format } from "date-fns";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import { FormSchedule } from "../../components/FormSchedule";
import { BasicEditModal } from "../../components/modal/BasicEditModal";
import { WhatsAppService } from "../../service/api/whatsapp/whatsapp";
import { FormSales } from "../sales/FormSales";
import { SalesService } from "../../service/api/sales/sales";
import { DivInline } from "../../components/containers/DivInline";
import {
  ColorsBootstrap,
  GenericModal
} from "../../components/modal/GenericModal";
import { GenericButton } from "../../components/buttons/GenericButton";
import { LabelForm } from "../../components/labels/LabelForm";
import { LabelSmall } from "../../components/labels/LabelSmal";
import { randomId } from "../../utils/random";
import { ClientsInterface } from "../../service/api/client/types";
import { OutgoingService } from "../../service/api/outgoing/outgoing";
import { OutgoingPaymentMethodEnums } from "../../service/api/outgoing/types";
import { ScheduleService } from "../../service/api/schedule/schedule";
import { ScheduleInterface } from "../../service/api/schedule/types";
import {
  TableMultiFilter,
  TypeMultiFilter
} from "../../components/tableMultiFilter/index";

export function Schedules(props: {
  clientService: ClientService;
  scheduleService: ScheduleService;
  whatsAppService: WhatsAppService;
  salesService: SalesService;
  outgoingService: OutgoingService;
}) {
  const {
    scheduleService,
    clientService,
    whatsAppService,
    salesService,
    outgoingService
  } = props;

  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const [date, setDate] = useState<string>("");
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: null });

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const [openModal, setOpenModal] = useState<any>({});
  const [openModalSale, setOpenModalSale] = useState<any>({});

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);

  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      unauthorized
    } = await clientService.fetchAllClients();
    setLoader(null);

    if (success) {
      dispatch(clearClient());
      setClients(data);
      dispatch(clientAdded(data));
    } else if (!error && !unauthorized) {
      await getAllClients();
    } else {
      setAlert(<AlertInfo title="Por favor, recarregue a página." />);
    }
  };

  const fetchExpireds = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data } = await scheduleService.expireds();
    setLoader(null);

    if (success) {
      setSchedules(data);
    }
  };

  useEffect(() => {
    fetchExpireds();
    if (!clientsCache.length) {
      getAllClients();
    } else {
      setClients(clientsCache);
    }
  }, []);

  const fetchByDate = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      badRequest,
      notFound
    } = await scheduleService.fetchByDate(date);
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
      setSchedules(data);
    }
    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma agenda encontrada." />);
    }
  };

  const fetchByClient = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      badRequest,
      notFound
    } = clientSelected.idclients
      ? await scheduleService.fetchByIdClient(clientSelected.idclients)
      : await scheduleService.fetchByClientName(clientSelected.label);
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Pesquisa atualizada." />);
      setSchedules(data);
    }
    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma agenda encontrada." />);
    }
  };

  const onChangeSchedule = async (params: {
    idschedules: number;
    idclients: number;
    clientName: string;
    description: string;
    time: string;
    date: string;
    pacote: boolean;
    atendenceCount: number;
    totalAtendenceCount: number;
    status: string;
  }): Promise<boolean> => {
    setLoader(<CircularIndeterminate />);
    const { success, error, badRequest } = await scheduleService.update({
      idschedules: params.idschedules,
      idclients: params.idclients,
      clientName: params.clientName,
      description: params.description,
      time: params.time,
      date: params.date,
      pacote: params.pacote,
      atendenceCount: params.atendenceCount,
      totalAtendenceCount: params.totalAtendenceCount,
      status: params.status
    });
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Agenda editada com sucesso." />);
      await handleSubmitFilters();
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

  const onDelete = async (idschedules: number): Promise<boolean> => {
    setLoader(<CircularIndeterminate />);
    const { success, error, notFound } = await scheduleService.delete(
      idschedules
    );
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Agenda excluída com sucesso." />);
      await handleSubmitFilters();
      return true;
    }
    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Agenda não encontrada." />);
    }
    return false;
  };

  const finish = async (idschedules: number): Promise<boolean> => {
    setLoader(<CircularIndeterminate />);
    const { success, error, notFound } = await scheduleService.finish(
      idschedules
    );
    setLoader(null);

    if (success) {
      setOpenModal(false);
      await handleSubmitFilters();
      return true;
    }
    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Agenda não encontrada." />);
    }
    return false;
  };

  const onCreateSale = async (params: {
    idclients: number;
    clientName: string;
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
    paymentMethod: OutgoingPaymentMethodEnums;
  }) => {
    setLoader(<CircularIndeterminate />);
    const { success, error, badRequest } = await salesService.create({
      idclients: params.idclients || null,
      clientName: params.clientName || null,
      description: params.description,
      date: params.date,
      total: params.total,
      paymentPending: params.paymentPending,
      paymentDate: params.paymentDate,
      paymentMethod: params.paymentMethod
    });
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Venda criada com sucesso." />);
      setOpenModalSale(false);
    }
    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }
  };

  const handleSubmitFilters = async () => {
    if (
      (date && clientSelected.idclients) ||
      (!date && clientSelected.idclients) ||
      (!date && !clientSelected.idclients && clientSelected.label)
    ) {
      await fetchByClient();
    }

    if (date && !clientSelected.idclients) {
      await fetchByDate();
    }

    return true;
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <Breadcumb
        page={[
          { link: "/create-schedule", name: "Nova agenda" },
          { link: false, name: "Suas agendas" }
        ]}
      />
      <TitlePrincipal title="Agendas" />

      {loader}

      <TableMultiFilter
        filters={[
          {
            label: "Data",
            value: date,
            placeholder: "",
            type: TypeMultiFilter.date,
            handleChangeValue: setDate,
            disabled: clientSelected.label ? true : false
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
              if (typeof item === "object") {
                setClientSelected({
                  label: item.label,
                  idclients: item.value
                });
              }
            },
            disabled: date ? true : false
          }
        ]}
        clearFilters={(e: React.BaseSyntheticEvent) => {
          setDate("");
          setClientSelected({ label: "", idclients: null });
        }}
        handleSubmit={handleSubmitFilters}
      />

      {alert}

      {schedules.length
        ? schedules.map((schedule: ScheduleInterface) => {
            return (
              <div className="schedule_card" key={randomId()}>
                {schedule.expired ? (
                  <small className="h6 text-danger font-weight-bold pulse">
                    Horário expirado
                  </small>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end"
                  }}
                >
                  {schedule.phone ? (
                    <WhatsAppIconButton
                      onClick={(e: React.SyntheticEvent) => {
                        whatsAppService.redirectToWhatsappWithMessage({
                          event: e,
                          client:
                            schedule.clientName || (schedule.name as string),
                          phone: schedule.phone as string,
                          date: schedule.date,
                          time: schedule.time,
                          totalAtendenceCount: schedule.totalAtendenceCount,
                          atendenceCount: schedule.atendenceCount as number,
                          description: schedule.description
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
                      sx={{ color: "red" }}
                    >
                      Excluir Agenda
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Tem certeza que deseja excluir essa agenda?
                    </Typography>
                  </BasicDeleteModal>
                </div>

                <LabelForm text="Cliente" className="pb-2 border-bottom">
                  <LabelSmall
                    text={schedule.name || (schedule.clientName as string)}
                  />
                </LabelForm>
                <LabelForm text="Descrição" className="pb-2 border-bottom">
                  <LabelSmall text={schedule.description} />
                </LabelForm>

                <DivInline className="row">
                  <LabelForm
                    text="Data"
                    className="col-sm-6 pb-2 border-bottom"
                  >
                    <LabelSmall
                      text={format(
                        new Date(schedule.date.replace("Z", "")),
                        "dd/MM/yyyy"
                      )}
                    />
                  </LabelForm>
                  <LabelForm
                    text="Horário"
                    className="col-sm-6 pb-2 border-bottom"
                  >
                    <LabelSmall text={schedule.time + "h"} />
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

                <LabelForm text="Criado em" className="border-bottom pb-2 mb-2">
                  <LabelSmall
                    text={format(
                      new Date(
                        schedule.createdAt
                          ? schedule.createdAt.replace("Z", "")
                          : (schedule.createdAt as string)
                      ),
                      "dd/MM/yyyy 'às' HH:mm'h'"
                    ).toString()}
                  />
                </LabelForm>

                <DivInline style={{ marginLeft: "2px", marginTop: "15px" }}>
                  <GenericModal
                    btnOpenName="Finalizar"
                    color={ColorsBootstrap.primary}
                    styleModal={{ padding: "20px" }}
                    styleBtn={{ marginRight: "10px" }}
                    openModal={
                      openModal[schedule.idschedules as number] || false
                    }
                    setOpenModal={(value: boolean) =>
                      setOpenModal({
                        ...openModalSale,
                        [schedule.idschedules as number]: value
                      })
                    }
                  >
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      sx={{ color: "#0275d8" }}
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
                        marginTop: "15px"
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
                        [schedule.idschedules as number]: value
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
