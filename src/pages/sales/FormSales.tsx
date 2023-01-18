import { FormControlLabel, Checkbox } from "@material-ui/core";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import { mask } from "../../service/mask-money";
import React, { useEffect, useState } from "react";
import { ClientsInterface } from "../clients/Clients";
import { ScheduleInterface } from "../../service/schedule";
import { format } from "date-fns";
import { InputText } from "../../components/inputs/InputText";
import { DivInline } from "../../components/divs/DivInline";

type InputProps = {
  clients: ClientsInterface[];
  onChange: any;
  alert: JSX.Element | null;
  schedule?: ScheduleInterface;
};

export function FormSales(props: InputProps) {
  const { clients, onChange, alert, schedule } = props;

  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [paymentPending, setPaymentPending] = useState<boolean>(false);
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: null });

  const clearFields = () => {
    setDescription("");
    setDate("");
    setPrice("");
    setPaymentPending(false);
    setPaymentDate("");
    setClientSelected({ label: "", idclients: 0 });
  };

  useEffect(() => {
    if (schedule) {
      setDescription(schedule.description);
      setDate(format(new Date(schedule.date), "yyyy-MM-dd"));
      setPrice("");
      setPaymentDate("");
      setClientSelected({
        label: schedule.name || (schedule.clientName as string),
        idclients: schedule.idclients
      });
    }
  }, []);

  return (
    <div className="form_sales">
      <small className="font-weight-bold pb-4">
        Os campos que possuem " * " são obrigatórios!
      </small>

      {schedule ? (
        <InputText
          type="text"
          value={clientSelected.label}
          onChange={null}
          label="Cliente"
          disabled={true}
          className="mt-2 mb-2"
        />
      ) : (
        <div className="mb-1 mt-2">
          {clients.length ? (
            <ComboBoxList
              options={clients.map(client => {
                return {
                  label: client.name,
                  idclients: client.idclients
                };
              })}
              label={"Selecione o Cliente"}
              value={clientSelected.label}
              onChange={(
                e: React.BaseSyntheticEvent,
                item: { label: string; idclients: number }
              ) => {
                if (typeof item === "string") {
                  setClientSelected({
                    label: item,
                    idclients: clientSelected.idclients
                  });
                } else {
                  setClientSelected({
                    label: item.label,
                    idclients: item.idclients
                  });
                }
              }}
            />
          ) : null}
        </div>
      )}

      <TextFieldMultiline
        label="Descrição*"
        value={description}
        fnChange={(e: React.BaseSyntheticEvent) => {
          setDescription(e.target.value);
        }}
        rows={3}
      />
      <DivInline className="mb-1">
        <div className="col">
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
        <div className="col">
          <FullWidthTextField
            type="date"
            label=""
            value={date}
            fnChange={(e: React.BaseSyntheticEvent) => {
              setDate(e.target.value);
            }}
          />
        </div>
      </DivInline>

      <div className="payment_form">
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e: any) => {
                setPaymentPending(!paymentPending);
              }}
              color="primary"
              checked={paymentPending}
            />
          }
          label="Pagamento recebido?"
        />

        {!paymentPending ? (
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

      <DivInline className="mt-2">
        {schedule ? null : (
          <button
            className="btn btn-secondary col font-weight-bold"
            onClick={async (e: React.SyntheticEvent) => clearFields()}
          >
            Limpar
          </button>
        )}
        <div className="col">
          <button
            className="btn btn-primary col font-weight-bold"
            onClick={e => {
              const result = onChange({
                idclients: clientSelected.idclients,
                description,
                date,
                total: parseInt(price.substring(2).replace(/\.|,/g, "")) / 100,
                paymentPending,
                paymentDate
              });
              if (result) {
                clearFields();
              }
            }}
          >
            Gerar Venda
          </button>
        </div>
      </DivInline>

      <div className="mt-3">{alert}</div>
    </div>
  );
}

// Feliz Ano Novo Habbo!
