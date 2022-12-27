import React, { useState, useEffect } from "react";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";
import { Breadcumb } from "../components/Breadcumb";
import { ClientService } from "../service/client-service";
import { AlertError } from "../components/alerts/AlertError";
import { AlertSuccess } from "../components/alerts/AlertSuccess";
import { TIMEOUT } from "../utils/constants";
import { FormClient } from "../components/FormClient";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ReduceStore } from "../app/store";
import { ComeBack } from "../components/ComeBack";
import { clientAdded } from "../reducers/clients-slice";

export type EditClientRequest = {
  event: React.SyntheticEvent;
  idclients: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: number;
  note?: string;
};

export function EditClient(props: { clientService: ClientService }) {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const clients = useSelector((state: ReduceStore) => state.client);
  const client = clients.find(item => item.idclients === Number(clientId));
  const { clientService } = props;

  const [alert, setAlert] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!clientId || !client) {
      navigate(-1);
    }
  }, []);

  const dispatch = useDispatch();
  const getAllClients = async () => {
    const { data } = await clientService.fetchAllClients();
    dispatch(clientAdded(data));
  };

  const editClient = async (
    params: EditClientRequest
  ): Promise<{ success: boolean }> => {
    params.event.preventDefault();
    console.log(params);
    const { error, conflict, badRequest } = await clientService.editClinet({
      idclients: params.idclients,
      name: params.name,
      email: params.email,
      phone: params.phone,
      address: params.address,
      addressNumber: params.addressNumber,
      note: params.note
    });

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
    <div className="container-main">
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
      />
    </div>
  );
}
