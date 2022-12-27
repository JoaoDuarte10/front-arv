import React, { useEffect, useState } from "react";
import { Breadcumb } from "../components/Breadcumb";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduceStore } from "../app/store";
import { format } from "date-fns";
import { ComeBack } from "../components/ComeBack";

export function InfoClients() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const clients = useSelector((state: ReduceStore) => state.client);
  const client = clients.find(item => item.idclients === Number(clientId));

  useEffect(() => {
    if (!clientId || !client) {
      navigate(-1);
    }
  }, []);

  return (
    <div className="container-main">
      <Breadcumb
        page={[
          { link: "/clients", name: "Clientes" },
          { link: false, name: "Informações do cliente" }
        ]}
      />
      <ComeBack />
      <br />
      <TitlePrincipal title="Informações do cliente" />

      {client ? (
        <div className="container_info_client">
          <h6 className="label_info_client">
            Nome: <small className="text-muted h6 mb-3">{client.name}</small>
          </h6>
          <div className="form-row">
            <h6 className="label_info_client col">
              Email:{" "}
              <small className="text-muted h6 mb-3">{client.email}</small>
            </h6>
            <h6 className="label_info_client col">
              Celular:{" "}
              <small className="text-muted h6 mb-3">{client.phone}</small>
            </h6>
          </div>
          <div className="form-row">
            <h6 className="label_info_client col">
              Endereço:{" "}
              <small className="text-muted h6 mb-3">{client.address}</small>
            </h6>
            <h6 className="label_info_client col">
              Número:{" "}
              <small className="text-muted h6 mb-3">
                {client.addressnumber}
              </small>
            </h6>
          </div>
          <h6 className="label_info_client">
            Segmento:{" "}
            <small className="text-muted h6 mb-3">
              {client.segment || "Não tem um segmento"}
            </small>
          </h6>
          <h6 className="label_info_client">
            Criado em:{" "}
            <small className="text-muted h6 mb-3">
              {format(new Date(client.created_at), "dd/MM/yyyy 'às' HH:mm'h'")}
            </small>
          </h6>
          <h6 className="label_info_client">
            Última atualização:{" "}
            <small className="text-muted h6 mb-3">
              {client.updated_at || "Nenhuma atualização"}
            </small>
          </h6>
          <h6 className="label_info_client">
            Observação:{" "}
            <small className="text-muted h6 mb-3">{client.note}</small>
          </h6>
        </div>
      ) : null}
    </div>
  );
}
