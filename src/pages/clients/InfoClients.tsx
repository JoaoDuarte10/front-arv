import React, { useEffect, useState } from "react";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduceStore } from "../../app/store";
import { format } from "date-fns";
import { ComeBack } from "../../components/ComeBack";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { LabelSmall } from "../../components/labels/LabelSmal";
import { LabelForm } from "../../components/labels/LabelForm";
import { DivInline } from "../../components/containers/DivInline";
import { SalesService } from "../../service/api/sales/sales";
import { SalesInterface } from "../../service/api/sales/types";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { TableSales } from "../../components/sales/TableSales";
import { SearchFilterButton } from "../../components/buttons/SearchFilter";
import { TIMEOUT } from "../../utils/constants";
import { ClearSearchFilterButton } from "../../components/buttons/ClearSearchFilter";
import { WhatsAppIconButton } from "../../components/buttons/WhatsAppIconButton";
import { EditIconButton } from "../../components/buttons/EditIconButton";
import { BasicDeleteModal } from "../../components/modal/BasicDeleteModal";
import Typography from "@mui/material/Typography";
import { ClientService } from "../../service/api/client/client-service";
import { WhatsAppService } from "../../service/api/whatsapp/whatsapp";

export function InfoClients(props: {
  salesService: SalesService;
  clientService: ClientService;
  whatsAppService: WhatsAppService;
}) {
  const { salesService, clientService, whatsAppService } = props;

  const { clientId } = useParams();
  const navigate = useNavigate();

  const clients = useSelector((state: ReduceStore) => state.client);
  const client = clients.find(item => item.idclients === Number(clientId));
  const [sales, setSales] = useState<SalesInterface[]>([]);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  useEffect(() => {
    if (!clientId || !client) {
      navigate(-1);
    }
  }, []);

  const fetchSalesByClient = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data, error, notFound } = await salesService.findByClient(
      Number(clientId)
    );
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const fetchSalesPending = async () => {
    setLoader(<CircularIndeterminate />);
    const {
      success,
      data,
      error,
      notFound
    } = await salesService.findPendingByClient(Number(clientId));
    setLoader(null);

    if (success) {
      setSales(data);
      setAlert(<AlertSuccess title="Pesquisa atualizada" />);
    }
    if (notFound) {
      setAlert(<AlertInfo title="Nenhuma venda encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

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
      navigate(-1);
    }
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
          { link: false, name: "Informações do cliente" }
        ]}
      />
      <ComeBack />
      <br />
      <TitlePrincipal title="Informações do cliente" />

      {client && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <WhatsAppIconButton
            onClick={(e: React.SyntheticEvent) => {
              whatsAppService.redirectToWhatsapp(e, client.phone);
            }}
          />
          <Link className="" to={`/edit-client/${client.idclients}`}>
            <EditIconButton />
          </Link>
          <BasicDeleteModal
            btnName="Excluir"
            onChange={(e: React.SyntheticEvent) => {
              onDeleteClient(client.idclients);
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
      )}
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
                new Date(client.created_at.replace("Z", "")),
                "dd/MM/yyyy 'às' HH:mm'h'"
              )}
            />
          </LabelForm>
          <LabelForm text="Última atualização" className="pb-2 border-bottom">
            <LabelSmall
              text={
                client.updated_at
                  ? format(
                      new Date(client.updated_at.replace("Z", "")),
                      "dd/MM/yyyy 'às' HH:mm'h'"
                    )
                  : "Nenhuma atualização"
              }
            />
          </LabelForm>
          <LabelForm text="Observação">
            <LabelSmall text={client.note || "Nenhuma observação"} />
          </LabelForm>
        </div>
      ) : null}

      <hr className="mt-4" />

      <div>
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchSalesByClient()}
          text="Vendas do cliente"
        />
        <SearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => fetchSalesPending()}
          text="Vendas pendentes"
        />
        <ClearSearchFilterButton
          onClick={(e: React.BaseSyntheticEvent) => setSales([])}
        />

        {alert}

        {sales.length ? (
          <div>
            <TableSales sales={sales} salesService={salesService} />
            <strong>Total:</strong>{" "}
            {salesService.countTotalValueSales(
              sales
                .filter(sale => sale.paymentStatus === "PAID")
                .map(sale => Number(sale.total))
            )}
          </div>
        ) : null}
      </div>
    </ContainerMain>
  );
}
