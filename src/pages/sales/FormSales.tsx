import { FormControlLabel, Checkbox } from "@mui/material";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import { mask } from "../../utils/mask-money";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { InputText } from "../../components/inputs/InputText";
import { DivInline } from "../../components/containers/DivInline";
import { OutgoingService } from "../../service/api/outgoing/outgoing";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { GenericButton } from "../../components/buttons/GenericButton";
import { ColorsBootstrap } from "../../components/modal/GenericModal";
import { ClientsInterface } from "../../service/api/client/types";
import { OutgoingPaymentMethodEnums } from "../../service/api/outgoing/types";
import { ScheduleInterface } from "../../service/api/schedule/types";
import { DateInput } from "../../components/date/index";

type InputProps = {
  clients: ClientsInterface[];
  onChange: any;
  alert: JSX.Element | null;
  schedule?: ScheduleInterface;
  outgoingService: OutgoingService;
};

export function FormSales(props: InputProps) {
  const { clients, onChange, alert, schedule, outgoingService } = props;

  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState<Date | string | null>(null);
  const [paymentDate, setPaymentDate] = useState<Date | string | null>(null);
  const [paymentPending, setPaymentPending] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<
    OutgoingPaymentMethodEnums | string
  >("");
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<string>(
    ""
  );
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: null });

  const [loader, setLoader] = useState<boolean>(false);

  const clearFields = () => {
    setDescription("");
    setDate(null);
    setPrice("");
    setPaymentPending(false);
    setPaymentDate(null);
    setClientSelected({ label: "", idclients: 0 });
    setPaymentMethodSelected("");
  };

  const fetchPaymentMethodsEnums = async () => {
    setLoader(true);
    const { success, data } = await outgoingService.fetchPaymentMethodEnums();
    setLoader(false);

    if (success) {
      setPaymentMethods(data);
    }
  };

  useEffect(() => {
    fetchPaymentMethodsEnums();
    if (schedule) {
      setDescription(schedule.description);
      setDate(schedule.date);
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
      <CircularIndeterminate open={loader} />

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
            customChange={(e: React.BaseSyntheticEvent) => {
              let val = e.target.value;
              const { maskedValue } = mask(val, 2, ",", ".", false, "R$");
              setPrice(maskedValue);
            }}
          />
        </div>
        <div className="col">
          <DateInput
            value={
              typeof date === "string" ? new Date(date.replace("Z", "")) : date
            }
            setValue={setDate}
            label="Data"
          />
        </div>
      </DivInline>

      <ComboBoxList
        options={Object.keys(paymentMethods).map((method: string) => {
          return {
            label: method
          };
        })}
        label={"Forma de pagamento *"}
        value={paymentMethodSelected}
        onChange={(e: React.BaseSyntheticEvent, item: { label: string }) => {
          if (item && item.label) {
            setPaymentMethodSelected(item.label as OutgoingPaymentMethodEnums);
          }
        }}
        className="mb-2"
      />

      <div className="payment_form mt-1">
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
            <DateInput
              value={paymentDate as Date}
              setValue={setPaymentDate}
              label="Data de previsão"
            />
          </div>
        ) : null}
      </div>

      <DivInline className="mt-2">
        {schedule ? null : (
          <div className="col">
            <GenericButton
              text="Limpar"
              color={ColorsBootstrap.secondary}
              onClick={(e: React.SyntheticEvent) => {
                clearFields();
              }}
            />
          </div>
        )}
        <div className="col">
          <GenericButton
            text="Gerar Venda"
            color={ColorsBootstrap.primary}
            onClick={async (e: React.BaseSyntheticEvent) => {
              const result = await onChange({
                idclients: clientSelected.idclients,
                clientName: clientSelected.label,
                description,
                date,
                total: parseInt(price.substring(2).replace(/\.|,/g, "")) / 100,
                paymentPending,
                paymentDate,
                paymentMethod: paymentMethodSelected
              });
              if (result) {
                clearFields();
              }
            }}
          />
        </div>
      </DivInline>

      <div className="mt-3">{alert}</div>
    </div>
  );
}

// Feliz Ano Novo Habbo!
