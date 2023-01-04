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
          <LabelForm text="Nome" className="pb-2 border-bottom">
            <LabelSmall text={client.name} />
          </LabelForm>
          <DivInline className="row">
            <LabelForm text="E-mail" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.email} />
            </LabelForm>
            <LabelForm text="Celular" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.phone} />
            </LabelForm>
          </DivInline>
          <DivInline className="row">
            <LabelForm text="Endereço" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.address} />
            </LabelForm>
            <LabelForm text="Número" className="col-sm-6 pb-2 border-bottom">
              <LabelSmall text={client.addressnumber} />
            </LabelForm>
          </DivInline>
          <LabelForm text="Segmento" className="pb-2 border-bottom">
            <LabelSmall text={client.segment || "Nenhum segmento"} />
          </LabelForm>
          <LabelForm text="Criado em" className="pb-2 border-bottom">
            <LabelSmall
              text={format(
                new Date(client.created_at),
                "dd/MM/yyyy 'às' HH:mm'h'"
              )}
            />
          </LabelForm>
          <LabelForm text="Última atualização" className="pb-2 border-bottom">
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
