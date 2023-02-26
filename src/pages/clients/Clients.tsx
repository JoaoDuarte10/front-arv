import React from "react";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Link, useNavigate } from "react-router-dom";
import { WhatsAppService } from "../../service/api/whatsapp/whatsapp";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import { Typography } from "@mui/material";
import { TIMEOUT } from "../../utils/constants";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { EditIconButton } from "../../components/buttons/EditIconButton";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { LabelForm } from "../../components/labels/LabelForm";
import { LabelSmall } from "../../components/labels/LabelSmal";
import { DivInline } from "../../components/containers/DivInline";
import { randomId } from "../../utils/random";
import { useClient } from "./hooks/useClients";
import { INFO_CLIENT_URL } from "./InfoClients";
import {
  TableMultiFilter,
  TypeMultiFilter
} from "../../components/tableMultiFilter/index";
import { Option } from "../../components/inputs/InputAutocompleteList";

export function Clients(props: { whatsAppService: WhatsAppService }) {
  const { whatsAppService } = props;
  const {
    resources,
    handleDeleteResource,
    loading,
    alert,
    setAlert
  } = useClient();

  const navigate = useNavigate();

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      <Breadcumb page={[{ link: false, name: "Clientes" }]} />
      <TitlePrincipal title="Clientes" />

      {alert}
      {loading ? <CircularIndeterminate /> : null}

      <TableMultiFilter
        filters={[
          {
            label: "Clientes",
            value: "",
            placeholder: "Selecione o cliente",
            type: TypeMultiFilter.select,
            options: resources.map(client => ({
              label: client.name,
              value: client.idclients
            })),
            handleChangeValue: (e: React.BaseSyntheticEvent, item: Option) => {
              if (typeof item === "object") {
                navigate(INFO_CLIENT_URL + item.value);
              }
            },
            disabled: false
          }
        ]}
        clearFilters={(e: React.BaseSyntheticEvent) => null}
        handleSubmit={() => Promise.resolve(true)}
        enableActionButtons={false}
      />

      {resources.length
        ? resources.map(client => {
            return (
              <div
                className="container_client"
                key={client.idclients + randomId()}
              >
                <div className="actions_client remove-style-link">
                  <Link
                    style={{
                      border: "1px solid #0275d8",
                      padding: "5px",
                      borderRadius: "15px"
                    }}
                    to={`${INFO_CLIENT_URL}${client.idclients}`}
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
                    <Link className="" to={`/client/edit/${client.idclients}`}>
                      <EditIconButton />
                    </Link>
                    <BasicDeleteModal
                      btnName="Excluir"
                      onChange={(e: React.SyntheticEvent) => {
                        handleDeleteResource(client.idclients);
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
                  <DivInline className="row">
                    <LabelForm
                      text="Nome"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall text={client.name} />
                    </LabelForm>
                    <LabelForm
                      text="Celular"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall text={client.phone} />
                    </LabelForm>
                  </DivInline>
                  {client.segment ? (
                    <LabelForm text="Segmento" className="pb-2 border-bottom">
                      <LabelSmall text={client.segment} />
                    </LabelForm>
                  ) : null}
                  {client.note ? (
                    <LabelForm text="Observação">
                      <LabelSmall text={client.note} />
                    </LabelForm>
                  ) : null}
                </div>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}
