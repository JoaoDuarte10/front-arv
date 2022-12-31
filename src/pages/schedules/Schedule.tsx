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
import { Link } from "react-router-dom";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { EditIconButton } from "../../components/buttons/EditIconButton";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import { FormSchedule } from "../../components/FormSchedule";
import { BasicEditModal } from "../../components/modal/BasicEditModal";
import { WhatsAppService } from "../../service/whatsapp";
import { FormSales } from "../sales/FormSales";
import { SalesService } from "../../service/sales";
import {
  ColorsBootstrap,
  GenericModal
} from "../../components/modal/GenericModal";
import {
  ColorsMaterialUi,
  GenericButton,
  Variant
} from "../../components/buttons/GenericButton";

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

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalSale, setOpenModalSale] = useState<boolean>(false);

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([
    // {
    //     "idschedules": 4,
    //     "idclients": 22,
    //     "clientName": null,
    //     "name": "Johnny007",
    //     "phone": "(35) 9 9955-4534",
    //     "description": "Teste novo hoje",
    //     "time": "08:40",
    //     "date": "2022-12-31T03:00:00.000Z",
    //     "pacote": true,
    //     "atendenceCount": 2,
    //     "totalAtendenceCount": 4,
    //     "status": "PENDING",
    //     "createdAt": "2022-12-31T11:40:25.201Z"
    // }
  ]);

  const [searchFilterDataOpen, setSearchFilterDataOpen] = useState<boolean>(
    false
  );
  const [searchFilterClientOpen, setSearchFilterClientOpen] = useState<boolean>(
    false
  );

  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

    if (data) {
      dispatch(clearClient());
      setClients(data);
      dispatch(clientAdded(data));
    } else {
      await getAllClients();
    }
  };

  useEffect(() => {
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
      setAlert(<AlertSuccess title="Agenda editada com sucesso." />);
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
      setAlert(<AlertSuccess title="Agenda finalizada com sucesso." />);
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
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchByDate()}
              style={{
                margin: "5px 0"
              }}
            />
          </div>
          <button
            className="btn btn-secondary mt-2"
            onClick={e => closeActionButtons()}
          >
            Fechar
          </button>
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
            <SearchButton
              onClick={(e: React.BaseSyntheticEvent) => fetchByClient()}
              style={{
                margin: "5px 0"
              }}
            />
          </div>
          <button
            className="btn btn-secondary mt-2"
            onClick={e => closeActionButtons()}
          >
            Fechar
          </button>
        </div>
      </Collapse>

      {alert}

      {schedules.length
        ? schedules.map(schedule => {
            return (
              <div className="schedule_card" key={schedule.idschedules}>
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
                      Atual:{" "}
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

                <div className="form-row mt-3" style={{ marginLeft: "2px" }}>
                  <GenericModal
                    btnOpenName="Finalizar"
                    color={ColorsBootstrap.primary}
                    styleModal={{ padding: "20px" }}
                    styleBtn={{ marginRight: "10px" }}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                  >
                    <div>
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
                    </div>
                  </GenericModal>
                  <GenericModal
                    btnOpenName="Gerar venda"
                    color={ColorsBootstrap.success}
                    openModal={openModalSale}
                    setOpenModal={setOpenModalSale}
                  >
                    <FormSales
                      clients={clients}
                      onChange={onCreateSale}
                      alert={alert}
                      schedule={schedule}
                    />
                  </GenericModal>
                </div>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}
