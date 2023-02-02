import React, { useEffect, useState } from "react";
import {
  OutgoingService,
  OutgoingInstallmentEnums,
  OutgoingPaymentMethodEnums
} from "../../service/outgoing";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { Breadcumb } from "../../components/Breadcumb";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { TIMEOUT } from "../../utils/constants";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import { DivInline } from "../../components/containers/DivInline";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import { mask } from "../../service/mask-money";
import { AlertInfo } from "../../components/alerts/AlertInfo";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";
import { AlertError } from "../../components/alerts/AlertError";

export function CreateOutgoing(props: { outgoingService: OutgoingService }) {
  const { outgoingService } = props;

  const [paymentMethods, setPaymentMethods] = useState<
    OutgoingPaymentMethodEnums
  >({} as any);
  const [installments, setInstallments] = useState<OutgoingInstallmentEnums>(
    {} as any
  );

  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | string>("");
  const [total, setTotal] = useState<string>("");
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<
    OutgoingPaymentMethodEnums | string
  >("");
  const [installmentSelected, setInstallmentSelected] = useState<
    OutgoingInstallmentEnums | string
  >("");

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  const fetchPaymentMethodsEnums = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data } = await outgoingService.fetchPaymentMethodEnums();
    setLoader(null);

    if (success) {
      setPaymentMethods(data);
    }
  };

  const fetchInstallmentEnums = async () => {
    setLoader(<CircularIndeterminate />);
    const { success, data } = await outgoingService.fetchInstallmentEnums();
    setLoader(null);

    if (success) {
      setInstallments(data);
    }
  };

  useEffect(() => {
    Promise.all([fetchInstallmentEnums(), fetchPaymentMethodsEnums()]);
  }, []);

  const clearFields = () => {
    setDescription("");
    setDate("");
    setTotal("");
    setPaymentMethodSelected("");
    setInstallmentSelected("");
  };

  const onCreateOutgoing = async () => {
    const payload = {
      description,
      date,
      total: parseInt(total.substring(2).replace(/\.|,/g, "")) / 100,
      paymentMethod: paymentMethodSelected as OutgoingPaymentMethodEnums,
      installment: installmentSelected as OutgoingInstallmentEnums
    };

    setLoader(<CircularIndeterminate />);
    const { success, badRequest, error } = await outgoingService.create(
      payload
    );
    setLoader(null);

    if (success) {
      setAlert(<AlertSuccess title="Despesa criada com sucesso." />);
      clearFields();
    }

    if (badRequest) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
    }

    if (error) {
      setAlert(<AlertError title="Erro ao processar sua requisição." />);
    }
  };

  return (
    <ContainerMain>
      {loader}
      <Breadcumb
        page={[
          { link: "/outgoings", name: "Suas despesas" },
          { link: false, name: "Nova despesa" }
        ]}
      />
      <TitlePrincipal title="Criar nova despesa" />

      <div style={{ backgroundColor: "white", padding: "15px" }}>
        <small className="font-weight-bold pb-4">
          Os campos que possuem " * " são obrigatórios!
        </small>

        <TextFieldMultiline
          label="Descrição *"
          value={description}
          fnChange={(e: React.BaseSyntheticEvent) => {
            setDescription(e.target.value);
          }}
          className="mt-1"
          rows={2}
        />

        <DivInline>
          <div className="col">
            <FullWidthTextField
              type="date"
              label=""
              value={date}
              fnChange={(e: React.BaseSyntheticEvent) => {
                setDate(e.target.value);
              }}
              helperText="Escolha a data"
            />
          </div>
          <div className="col">
            <FullWidthTextField
              type="text"
              label="Total *"
              value={total}
              fnChange={(e: React.BaseSyntheticEvent) => {
                let val = e.target.value;
                const { maskedValue } = mask(val, 2, ",", ".", false, "R$");
                setTotal(maskedValue);
              }}
            />
          </div>
        </DivInline>

        <DivInline>
          <div className="col mt-1 mb-1" style={{ minWidth: "250px" }}>
            <ComboBoxList
              options={Object.keys(installments).map((installment: string) => {
                return {
                  label: installment
                };
              })}
              label={"Prazo de pagamento *"}
              value={installmentSelected}
              onChange={(
                e: React.BaseSyntheticEvent,
                item: { label: string }
              ) => {
                if (item && item.label) {
                  setInstallmentSelected(
                    item.label as OutgoingInstallmentEnums
                  );
                }
              }}
            />
          </div>
          <div className="col mt-1 mb-1" style={{ minWidth: "250px" }}>
            <ComboBoxList
              options={Object.keys(paymentMethods).map((method: string) => {
                return {
                  label: method
                };
              })}
              label={"Forma de pagamento *"}
              value={paymentMethodSelected}
              onChange={(
                e: React.BaseSyntheticEvent,
                item: { label: string }
              ) => {
                if (item && item.label) {
                  setPaymentMethodSelected(
                    item.label as OutgoingPaymentMethodEnums
                  );
                }
              }}
            />
          </div>
        </DivInline>

        <DivInline className="mt-2">
          <div className="col">
            <button
              className="btn btn-secondary col font-weight-bold"
              onClick={async (e: React.SyntheticEvent) => clearFields()}
            >
              Limpar
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-primary col font-weight-bold"
              onClick={async e => onCreateOutgoing()}
            >
              Criar
            </button>
          </div>
        </DivInline>
        {alert}
      </div>
    </ContainerMain>
  );
}
