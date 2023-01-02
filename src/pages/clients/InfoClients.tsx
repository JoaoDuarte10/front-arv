import React, { useEffect } from "react";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduceStore } from "../../app/store";
import { format } from "date-fns";
import { ComeBack } from "../../components/ComeBack";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { LabelSmall } from "../../components/labels/LabelSmal";
import { LabelForm } from "../../components/labels/LabelForm";
import { DivInline } from "../../components/divs/DivInline";

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
    <ContainerMain>
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
          <LabelForm text="Nome">
            <LabelSmall text={client.name} />
          </LabelForm>
          <DivInline>
            <LabelForm text="E-mail" className="col">
              <LabelSmall text={client.email} />
            </LabelForm>
            <LabelForm text="Celular" className="col">
              <LabelSmall text={client.phone} />
            </LabelForm>
          </DivInline>
          <DivInline>
            <LabelForm text="Endereço" className="col">
              <LabelSmall text={client.address} />
            </LabelForm>
            <LabelForm text="Número" className="col">
              <LabelSmall text={client.addressnumber} />
            </LabelForm>
          </DivInline>
          <LabelForm text="Segmento">
            <LabelSmall text={client.segment} />
          </LabelForm>
          <LabelForm text="Criado em">
            <LabelSmall
              text={format(
                new Date(client.created_at),
                "dd/MM/yyyy 'às' HH:mm'h'"
              )}
            />
          </LabelForm>
          <LabelForm text="Última atualização">
            <LabelSmall
              text={
                format(
                  new Date(client.updated_at),
                  "dd/MM/yyyy 'às' HH:mm'h'"
                ) || "Nenhuma atualização"
              }
            />
          </LabelForm>
          <LabelForm text="Observação">
            <LabelSmall text={client.note || "Nenhuma observação"} />
          </LabelForm>
        </div>
      ) : null}
    </ContainerMain>
  );
}
