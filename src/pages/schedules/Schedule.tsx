import React, { useEffect, useState } from "react";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { ScheduleInterface, ScheduleService } from "../../service/schedule";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { Collapse } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import { SearchButton } from "../../components/buttons/SearchButton";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { ReduceStore } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { ClientService } from "../../service/client-service";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { ClientsInterface } from "../clients/Clients";
import { TIMEOUT } from "../../utils/constants";
import { format } from "date-fns";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import { FormSchedule } from "../../components/FormSchedule";
import { BasicEditModal } from "../../components/modal/BasicEditModal";
import { WhatsAppService } from "../../service/whatsapp";
import { FormSales } from "../sales/FormSales";
import { SalesService } from "../../service/sales";
import { DivInline } from "../../components/divs/DivInline";
import {
  ColorsBootstrap,
  GenericModal
} from "../../components/modal/GenericModal";
import { GenericButton } from "../../components/buttons/GenericButton";
import { LabelForm } from "../../components/labels/LabelForm";
import { LabelSmall } from "../../components/labels/LabelSmal";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export function Schedules(props: {
  clientService: ClientService;
  scheduleService: ScheduleService;
  whatsAppService: WhatsAppService;
  salesService: SalesService;
}) {
  const {
    scheduleService,
    clientService,
    whatsAppService,
    salesService
  } = props;

  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const [date, setDate] = useState<string>("");
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number;
  }>({ label: "", idclients: 0 });

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const [openModal, setOpenModal] = useState<any>({});
  const [openModalSale, setOpenModalSale] = useState<any>({});

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);

  const [searchFilterDataOpen, setSearchFilterDataOpen] = useState<boolean>(
    false
  );
  const [searchFilterClientOpen, setSearchFilterClientOpen] = useState<boolean>(
    false
  );
  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data } = await clientService.fetchAllClients();
    setLoader(null);

    if (success) {
      dispatch(clearClient());
      setClients(data);
      dispatch(clientAdded(data));
    } else {
      await getAllClients();
    }
  };

  const fetchExpireds = async () => {
    const { success, data } = await scheduleService.expireds();

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
    } = await scheduleService.fetchByClient(clientSelected.idclients);
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
      setAlert(
        <AlertSuccess title="Agenda editada com sucesso. Atualize a pesquisa." />
      );
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
      setAlert(
        <AlertSuccess title="Agenda excluída com sucesso. Atualize a pesquisa." />
      );
      await fetchExpireds();
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
      setAlert(
        <AlertSuccess title="Agenda finalizada com sucesso. Atualize a pesquisa." />
      );
      setOpenModal(false);
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
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
  }) => {
    setLoader(<CircularIndeterminate />);
    const { success, error, badRequest } = await salesService.create({
      idclients: params.idclients || null,
      description: params.description,
      date: params.date,
      total: params.total,
      paymentPending: params.paymentPending,
      paymentDate: params.paymentDate
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

  const closeActionButtons = () => {
    setSearchFilterDataOpen(false);
    setSearchFilterClientOpen(false);
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

      <div className="filter_buttons">
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterDataOpen(!searchFilterDataOpen);
            setSearchFilterClientOpen(false);
          }}
          text="Data"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setSearchFilterClientOpen(!searchFilterClientOpen);
            setSearchFilterDataOpen(false);
          }}
          text="Cliente"
        />
        <ClearSearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => {
            setDate("");
            setClientSelected({ label: "", idclients: 0 });
          }}
        />
      </div>

      <Collapse in={searchFilterDataOpen} timeout="auto" unmountOnExit>
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

      <Collapse in={searchFilterClientOpen} timeout="auto" unmountOnExit>
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
              onClick={(e: React.BaseSyntheticEvent) => fetchByClient()}
            />
          </div>
        </div>
      </Collapse>

      {alert}

      {schedules.length
        ? schedules.map((schedule: ScheduleInterface) => {
            return (
              <div className="schedule_card" key={schedule.idschedules}>
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
                    openModal={openModal[schedule.idschedules as number]}
                    setOpenModal={(value: boolean) =>
                      setOpenModal({
                        ...openModalSale,
                        [schedule.idschedules as number]: value
                      })
                    }
                    key={schedule.idschedules || 0}
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
                    openModal={openModalSale[schedule.idschedules as number]}
                    setOpenModal={(value: boolean) =>
                      setOpenModalSale({
                        ...openModalSale,
                        [schedule.idschedules as number]: value
                      })
                    }
                    key={schedule.idschedules || 0}
                  >
                    <FormSales
                      clients={clients}
                      onChange={onCreateSale}
                      alert={alert}
                      schedule={schedule}
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
