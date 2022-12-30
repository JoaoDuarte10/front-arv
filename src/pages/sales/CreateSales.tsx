import React, { useEffect, useState } from "react";
import { ContainerMain } from "../../components/divs/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { ComboBox } from "../../components/ComboBox";
import { mask } from "../../service/mask-money";
import { ClientService } from "../../service/client-service";
import { ClientsInterface } from "../clients/Clients";
import { useDispatch, useSelector } from "react-redux";
import { clientAdded } from "../../reducers/clients-slice";
import { ReduceStore } from "../../app/store";
import { TIMEOUT } from "../../utils/constants";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import { SalesService } from "../../service/sales";
import { AlertError } from "../../components/alerts/AlertError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import ComboBoxList from '../../components/inputs/InputAutocompleteList';

export function CreateSales(props: {
  clientService: ClientService;
  salesService: SalesService;
}) {
  const dispatch = useDispatch();

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const { clientService, salesService } = props;

  const [idclients, setIdClients] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentPending, setPaymentPending] = useState<boolean>(true);

  const [clientSelected, setClientSelected] = useState<string>("");

  const [clients, setClients] = useState<ClientsInterface[]>([]);
  const [alert, setAlert] = useState<JSX.Element | null>(null);

  const getAllClients = async () => {
    const { data } = await clientService.fetchAllClients();
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

  const clearFields = () => {
    setIdClients(0);
    setDescription("");
    setDate("");
    setPrice("");
    setPaymentDate("");
    setClientSelected("");
  };

  const onCreate = async () => {
    const priceParsed = parseInt(price.substring(2).replace(/\.|,/g, "")) / 100;

    const { success, error, badRequest } = await salesService.create({
      idclients: idclients || null,
      description,
      date,
      total: priceParsed,
      paymentPending: paymentPending,
      paymentDate
    });

    if (success) {
      setAlert(<AlertSuccess title="Venda criada com sucesso." />);
      clearFields();
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
      <Breadcumb
        page={[
          { link: "sales", name: "Vendas" },
          { link: false, name: "Nova venda" }
        ]}
      />
      <TitlePrincipal title="Nova venda" />

      <div className="form_sales">
        <small className="font-weight-bold pb-4">Os campos que possuem " * " são obrigatórios!</small>
        <div className="form-group mb-2 mt-2">
          {clients.length ? (
            <ComboBoxList
              options={clients.map(client => {
                return {
                  label: client.name,
                  idclients: client.idclients
                };
              })}
              label={"Selecione o Cliente"}
              value={clientSelected}
              onChange={(
                e: React.BaseSyntheticEvent,
                item: { label: string; idclients: number }
              ) => {
                if (!item) {
                  setIdClients(0);
                  return;
                }
                setIdClients(item.idclients);
                setClientSelected(item.label);
              }}
            />
          ) : null}
        </div>
        <TextFieldMultiline
          label="Descrição*"
          value={description}
          fnChange={(e: React.BaseSyntheticEvent) => {
            setDescription(e.target.value);
          }}
          rows={3}
        />
        <div className="form-row">
          <div className="form-group col">
            <FullWidthTextField
              type="text"
              label="Preço*"
              value={price}
              fnChange={(e: React.BaseSyntheticEvent) => {
                let val = e.target.value;
                const { maskedValue } = mask(val, 2, ",", ".", false, "R$");
                setPrice(maskedValue);
              }}
            />
          </div>
          <div className="form-group col">
            <FullWidthTextField
              type="date"
              label=""
              value={date}
              fnChange={(e: React.BaseSyntheticEvent) => {
                setDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="payment_form">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e: any) => {
                    if (paymentPending) {
                      setPaymentPending(false);
                    } else {
                      setPaymentPending(true);
                    }
                  }}
                  color="primary"
                />
              }
              label="Pagamento recebido?"
            />
          </FormGroup>

          {paymentPending ? (
            <div className="">
              <small className="font-weight-bold text-primary">
                Data de previsão do pagamento
              </small>
              <FullWidthTextField
                type="date"
                label=""
                value={paymentDate}
                fnChange={(e: React.BaseSyntheticEvent) => {
                  setPaymentDate(e.target.value);
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="inline mt-2">
          <button
            className="btn btn-secondary col p-2 mt-2 mr-1 font-weight-bold"
            onClick={async (e: React.SyntheticEvent) => clearFields()}
          >
            Limpar Campos
          </button>
          <button
            className="btn btn-primary col p-2 mt-2 ml-1 font-weight-bold"
            onClick={async (e: React.SyntheticEvent) => onCreate()}
          >
            Gerar Venda
          </button>
        </div>

        <div className="mt-3">{alert}</div>
      </div>
    </ContainerMain>
  );
}
