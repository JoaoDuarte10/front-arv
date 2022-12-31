import React, { useEffect, useState } from "react";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { mask } from "../../service/mask-money";
import { ClientService } from "../../service/client-service";
import { ClientsInterface } from "../clients/Clients";
import { useDispatch, useSelector } from "react-redux";
import { clearClient, clientAdded } from "../../reducers/clients-slice";
import { ReduceStore } from "../../app/store";
import { TIMEOUT } from "../../utils/constants";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { SalesService } from "../../service/sales";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { ScheduleInterface } from "../../service/schedule";
import { FormSales } from "./FormSales";

export function CreateSales(props: {
  clientService: ClientService;
  salesService: SalesService;
}) {
  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const { clientService, salesService } = props;

  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

    if (data) {
      dispatch(clearClient());
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

  const onCreate = async (params: {
    idclients: number;
    description: string;
    date: string;
    total: number;
    paymentPending: boolean;
    paymentDate: string;
  }) => {
    setLoader(<CircularIndeterminate />);
    const { success, error, badRequest } = await salesService.create({
      idclients: params.idclients || null,
      description: params.description,
      date: params.date,
      total: params.total,
      paymentPending: params.paymentPending,
      paymentDate: params.paymentDate
    });
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Venda criada com sucesso." />);
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
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
          { link: "/sales", name: "Vendas" },
          { link: false, name: "Nova venda" }
        ]}
      />
      <TitlePrincipal title="Nova venda" />

      <FormSales clients={clients} onChange={onCreate} alert={alert} />
    </ContainerMain>
  );
}
