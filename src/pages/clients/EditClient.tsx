import React, { useState, useEffect } from "react";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { ClientService } from "../../service/api/client/client-service";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { FormClient } from "../../components/FormClient";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ReduceStore } from "../../app/store";
import { ComeBack } from "../../components/ComeBack";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { SegmentService } from "../../service/api/segment/segment";
import { SegmentInterface } from "../../service/api/segment/types";
import { segmentAdded } from "../../reducers/segment-sclice";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";

export type EditClientRequest = {
  event: React.SyntheticEvent;
  idclients: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: number;
  note?: string;
  idsegment: number | null;
};

export function EditClient(props: {
  clientService: ClientService;
  segmentService: SegmentService;
}) {
  const { clientService, segmentService } = props;

  const { clientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clients = useSelector((state: ReduceStore) => state.client);
  const client = clients.find(item => item.idclients === Number(clientId));

  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const [segments, setSegments] = useState<SegmentInterface[]>([]);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

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
    if (!clientId || !client) {
      navigate(-1);
    }
    if (!segmentCache.length) {
      getSegments();
    } else {
      setSegments(segmentCache);
    }
  }, []);

  const editClient = async (
    params: EditClientRequest
  ): Promise<{ success: boolean }> => {
    params.event.preventDefault();

    setLoader(<CircularIndeterminate />);
    const { error, conflict, badRequest } = await clientService.editClient({
      idclients: params.idclients,
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
    await getAllClients();
    navigate(-1);
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
          { link: false, name: "Editar Cliente" }
        ]}
      />
      <ComeBack />
      <br />
      <TitlePrincipal title="Editar cliente" />

      <FormClient
        edit={true}
        alert={alert}
        requestClient={editClient}
        client={client}
        segments={segments}
      />
    </ContainerMain>
  );
}
