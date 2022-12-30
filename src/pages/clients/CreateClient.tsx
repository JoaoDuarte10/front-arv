import React, { useEffect, useState } from "react";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { ClientService } from "../../service/client-service";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { FormClient } from "../../components/FormClient";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { useDispatch, useSelector } from "react-redux";
import { ReduceStore } from "../../app/store";
import { SegmentService, SegmentInterface } from "../../service/segment";
import { segmentAdded } from "../../reducers/segment-sclice";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";

export type CreateClientRequest = {
  event: React.SyntheticEvent;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: number;
  note?: string;
  idsegment: number | null;
};

export function CreateClient(props: {
  clientService: ClientService;
  segmentService: SegmentService;
}) {
  const { clientService, segmentService } = props;

  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const [segments, setSegments] = useState<SegmentInterface[]>([]);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const dispatch = useDispatch();

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

    dispatch(clearClient());
    dispatch(clientAdded(data));
  };

  const getSegments = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await segmentService.getAll();
    setLoader(null);

    dispatch(segmentAdded(data));
    setSegments(data);
  };

  useEffect(() => {
    if (!segmentCache.length) {
      getSegments();
    } else {
      setSegments(segmentCache);
    }
  }, []);

  const createClient = async (
    params: CreateClientRequest
  ): Promise<{ success: boolean }> => {
    params.event.preventDefault();

    setLoader(<CircularIndeterminate />);
    const { error, conflict, badRequest } = await clientService.createClinet({
      name: params.name,
      email: params.email,
      phone: params.phone,
      address: params.address,
      addressNumber: params.addressNumber,
      note: params.note || null,
      idsegment: params.idsegment
    });
    setLoader(null);

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
      return { success: false };
    }

    if (conflict) {
      setAlert(<AlertError title="Esse cliente já existe." />);
      return { success: false };
    }

    if (badRequest) {
      setAlert(<AlertError title="Preencha os campos corretamente." />);
      return { success: false };
    }

    setAlert(<AlertSuccess title="Cliente criado com sucesso" />);
    getAllClients();
    return { success: true };
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loader}

      <Breadcumb
        page={[
          { link: "/clients", name: "Clientes" },
          { link: false, name: "Novo Cliente" }
        ]}
      />
      <TitlePrincipal title="Novo cliente" />

      <FormClient
        edit={false}
        alert={alert}
        requestClient={createClient}
        segments={segments}
      />
    </ContainerMain>
  );
}
