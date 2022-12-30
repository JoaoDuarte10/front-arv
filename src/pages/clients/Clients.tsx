import React, { useState, useEffect } from "react";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { ClientService } from "../../service/client-service";
import { useDispatch, useSelector } from "react-redux";
import { clientAdded } from "../../reducers/clients-slice";
import { Link } from "react-router-dom";
import { WhatsAppService } from "../../service/whatsapp";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import Typography from "@mui/material/Typography";
import { TIMEOUT } from "../../utils/constants";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertError } from "../../components/alerts/AlertError";
import { ReduceStore } from "../../app/store";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { EditIconButton } from "../../components/buttons/EditIconButton";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";

export type ClientsInterface = {
  idclients: number;
  name: string;
  email: string;
  phone: string;
  segment: string;
  address: string;
  addressnumber: number;
  note: string;
  created_at: string;
  updated_at: string;
};

export function Clients(props: {
  clientService: ClientService;
  whatsAppService: WhatsAppService;
}) {
  const dispatch = useDispatch();
  const { clientService, whatsAppService } = props;

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

    if (data) {
      setClients(data);
      dispatch(clientAdded(data));
    }
  };

  useEffect(() => {
    if (!clientsCache.length) {
      getAllClients();
    } else {
      setClients(clientsCache);
    }
  }, []);

  const onDeleteClient = async (idclients: number) => {
    setLoader(<CircularIndeterminate />);
    const { success, error } = await clientService.deleteClient(idclients);
    setLoader(null);
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
      return;
    }

    if (success) {
      setAlert(<AlertSuccess title="Cliente deletado com sucesso." />);
      getAllClients();
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <Breadcumb page={[{ link: false, name: "Clientes" }]} />
      <TitlePrincipal title="Clientes" />

      {alert}
      {loader}

      {clients.length
        ? clients.map(client => {
            return (
              <div key={client.idclients}>
                <div className="container_client">
                  <div className="actions_client remove-style-link">
                    <Link
                      id="more_info_client"
                      to={`/info-client/${client.idclients}`}
                    >
                      Mais Informações
                    </Link>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <WhatsAppIconButton
                        onClick={(e: React.SyntheticEvent) => {
                          whatsAppService.redirectToWhatsapp(e, client.phone);
                        }}
                      />
                      <Link
                        className=""
                        to={`/edit-client/${client.idclients}`}
                      >
                        <EditIconButton />
                      </Link>
                      <BasicDeleteModal
                        btnName="Excluir"
                        onDeleteClient={async (e: React.SyntheticEvent) => {
                          await onDeleteClient(client.idclients);
                        }}
                      >
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                          sx={{ color: "red" }}
                        >
                          Excluir Cliente
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Tem certeza que deseja excluir esse cliente?
                        </Typography>
                      </BasicDeleteModal>
                    </div>
                  </div>

                  <div className="info_clients">
                    <div className="form-row">
                      <h6 className="label_client col">
                        Nome:{" "}
                        <small className="text-muted h6 mb-3">
                          {client.name}
                        </small>
                      </h6>
                      <h6 className="label_client col">
                        Celular:{" "}
                        <small className="text-muted h6 mb-3">
                          {client.phone}
                        </small>
                      </h6>
                    </div>
                    {client.segment ? (
                      <h6 className="label_client">
                        Segmento:{" "}
                        <small className="text-muted h6 mb-3">
                          {client.segment}
                        </small>
                      </h6>
                    ) : null}
                    {client.note ? (
                      <h6 className="label_client">
                        Observação:{" "}
                        <small className="text-muted h6 mb-3">
                          {client.note}
                        </small>
                      </h6>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}