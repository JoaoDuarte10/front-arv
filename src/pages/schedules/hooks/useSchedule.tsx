import React, { useEffect, useState } from 'react';
import { ScheduleInterface } from '../../../service/api/schedule/types';
import { ClientsInterface } from '../../../service/api/client/types';
import { useDispatch, useSelector } from 'react-redux';
import { ReduceStore } from '../../../app/store';
import { ClientService } from '../../../service/api/client/client-service';
import { API_RV_BASE_URI, localStorageService } from '../../../RoutesApp';
import { clearClient, clientAdded } from '../../../reducers/clients-slice';
import { AlertInfo } from '../../../components/alerts/AlertInfo';
import { ScheduleService } from '../../../service/api/schedule/schedule';
import { AlertSuccess } from '../../../components/alerts/AlertSuccess';
import { AlertError } from '../../../components/alerts/AlertError';
import { OutgoingPaymentMethodEnums } from '../../../service/api/outgoing/types';
import { SalesService } from '../../../service/api/sales/sales';
import { TIMEOUT } from '../../../utils/constants';

export const useSchedule = () => {
  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const clientService = new ClientService(API_RV_BASE_URI, localStorageService);
  const scheduleService = new ScheduleService(
    API_RV_BASE_URI,
    localStorageService,
  );
  const salesService = new SalesService(API_RV_BASE_URI, localStorageService);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [openModal, setOpenModal] = useState<any>({});
  const [openModalSale, setOpenModalSale] = useState<any>({});
  const [date, setDate] = useState<string>('');
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: '', idclients: null });

  const getAllClients = async () => {
    setLoader(true);
    const {
      success,
      data,
      error,
      unauthorized,
    } = await clientService.fetchAllClients();
    setLoader(false);

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
    setLoader(true);
    const { success, data } = await scheduleService.expireds();
    setLoader(false);

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

  const fetchByDate = async (date: string) => {
    setLoader(true);
    const {
      success,
      data,
      error,
      badRequest,
      notFound,
    } = await scheduleService.fetchByDate(date);
    setLoader(false);

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

  const fetchByClient = async (clientSelected: {
    label: string;
    idclients: number | null;
  }) => {
    setLoader(true);
    const {
      success,
      data,
      error,
      badRequest,
      notFound,
    } = clientSelected.idclients
      ? await scheduleService.fetchByIdClient(clientSelected.idclients)
      : await scheduleService.fetchByClientName(clientSelected.label);
    setLoader(false);

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
    idCatalogs?: number[];
  }): Promise<boolean> => {
    setLoader(true);
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
      status: params.status,
      idCatalogs: params.idCatalogs,
    });
    setLoader(false);

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
    setLoader(true);
    const { success, error, notFound } = await scheduleService.delete(
      idschedules,
    );
    setLoader(false);

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
    setLoader(true);
    const { success, error, notFound } = await scheduleService.finish(
      idschedules,
    );
    setLoader(false);

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
    setLoader(true);
    const { success, error, badRequest } = await salesService.create({
      idclients: params.idclients || null,
      clientName: params.clientName || null,
      description: params.description,
      date: params.date,
      total: params.total,
      paymentPending: params.paymentPending,
      paymentDate: params.paymentDate,
      paymentMethod: params.paymentMethod,
    });
    setLoader(false);

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
      await fetchByClient(clientSelected);
    }

    if (date && !clientSelected.idclients) {
      await fetchByDate(date);
    }

    return true;
  };

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

  return {
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
    onCreate,
  };
};
