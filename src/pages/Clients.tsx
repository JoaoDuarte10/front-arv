import React, { useState, useEffect } from "react";
import { Breadcumb } from "../components/Breadcumb";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";
import { ClientService } from "../service/client-service";
import { useDispatch } from "react-redux";
import { clientAdded } from "../reducers/clients-slice";
import { Link } from "react-router-dom";
import { randomId } from "../utils/random";
import { WhatsAppService } from "../service/whatsapp";
import { BasicDeleteModal } from "../components/modal/BasicDeleteModal";
import Typography from "@mui/material/Typography";
import { TIMEOUT } from "../utils/constants";
import { AlertSuccess } from "../components/alerts/AlertSuccess";
import { AlertError } from "../components/alerts/AlertError";

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

  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const getAllClients = async () => {
    const { data } = await clientService.fetchAllClients();
    setClients(data);
    dispatch(clientAdded(data));
  };

  useEffect(() => {
    getAllClients();
  }, []);

  const onDeleteClient = async (idclients: number) => {
    const { success, error } = await clientService.deleteClient(idclients);
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
      return;
    }

    if (success) {
      setAlert(<AlertSuccess title="Cliente deletedo com sucesso." />);
      getAllClients();
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <div className="container-main">
      <Breadcumb page={[{ link: false, name: "Clientes" }]} />
      <TitlePrincipal title="Clientes" />

      {alert}

      {clients.map(client => {
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
                    display: "flex"
                  }}
                >
                  <button
                    type="submit"
                    className="m-0 pl-2 pr-2 btn font-weight-bold"
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none"
                    }}
                    onClick={(e: React.SyntheticEvent) => {
                      whatsAppService.redirectToWhatsapp(e, client.phone);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="green"
                      className="bi bi-whatsapp"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                  </button>
                  <Link className="" to={`/edit-client/${client.idclients}`}>
                    <button
                      type="button"
                      className="m-0 pl-2 pr-2 btn"
                      key={randomId()}
                      style={{
                        border: "none",
                        backgroundColor: "transparent",
                        outline: "none"
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="blue"
                        className="bi bi-pencil-square"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                        />
                      </svg>
                    </button>
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
                    <small className="text-muted h6 mb-3">{client.name}</small>
                  </h6>
                  <h6 className="label_client col">
                    Celular:{" "}
                    <small className="text-muted h6 mb-3">{client.phone}</small>
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
                    <small className="text-muted h6 mb-3">{client.note}</small>
                  </h6>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
