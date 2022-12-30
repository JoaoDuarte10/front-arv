import React, { useState, useEffect } from "react";
import FullWidthTextField from "./inputs/TextFieldFullWidth";
import InputMaskPhone from "./inputs/InputMaskPhone";
import InputMaskNumber from "./inputs/InputMaskNumber";
import TextFieldMultiline from "./inputs/TextFieldMultiline";
import { ClientsInterface } from "../pages/clients/Clients";
import { ComboBox } from "./ComboBox";
import { SegmentInterface } from "../service/segment";
import ComboBoxList from './inputs/InputAutocompleteList';

type Response = {
  success: boolean;
};

type InputProps = {
  edit: boolean;
  alert: JSX.Element | null;
  requestClient: (params: any) => Promise<Response>;
  client?: ClientsInterface;
  segments: SegmentInterface[];
};

export function FormClient(props: InputProps) {
  const [idclients, setIdClients] = useState<number>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [addressNumber, setAddressNumber] = useState<number | any>();
  const [note, setNote] = useState<string>();
  const [segment, setSegment] = useState<number | null>(null);
  const [segmentSelected, setSegmentSelected] = useState<string>("");

  useEffect(() => {
    if (props.edit && props.client) {
      const findSegment: SegmentInterface | undefined = props.segments.find(
        segment => {
          if (props.client) return segment.name === props.client.name;
        }
      );
      if (findSegment) {
        setSegment(findSegment.idsegments);
      }
      setIdClients(props.client.idclients);
      setName(props.client.name);
      setEmail(props.client.email);
      setPhone(props.client.phone);
      setAddress(props.client.address);
      setAddressNumber(props.client.addressnumber);
      setNote(props.client.note);
      setSegmentSelected(props.client.segment);
    }
  }, []);

  const clearFields = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setAddressNumber("");
    setNote("");
    setSegment(null);
    setSegmentSelected("");
  };

  return (
    <div className="form_client">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="60"
          fill="#0275d8"
          className="bi bi-person-add"
          viewBox="0 0 16 16"
        >
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
        </svg>
      </div>
      <div className="pb-2">
        <small className="font-weight-bold">Os campos que possuem " * " são obrigatórios!</small>
      </div>
      <FullWidthTextField
        label="Nome*"
        value={name}
        fnChange={(e: React.BaseSyntheticEvent) => {
          setName(e.target.value);
        }}
      />
      <FullWidthTextField
        label="E-mail"
        value={email}
        fnChange={(e: React.BaseSyntheticEvent) => {
          setEmail(e.target.value);
        }}
      />
      <InputMaskPhone
        label="Celular*"
        value={phone}
        fnChange={(e: React.BaseSyntheticEvent) => {
          setPhone(e.target.value);
        }}
      />
      <div className="row">
        <div className="col-8">
          <FullWidthTextField
            label="Endereço"
            value={address}
            fnChange={(e: React.BaseSyntheticEvent) => {
              setAddress(e.target.value);
            }}
          />
        </div>
        <div className="col-4">
          <InputMaskNumber
            label="Número"
            value={addressNumber}
            fnChange={(e: React.BaseSyntheticEvent) => {
              setAddressNumber(e.target.value);
            }}
          />
        </div>
      </div>
      {props.segments.length ? (
        <ComboBoxList
          label="Selecionar segmento"
          options={props.segments.map(item => {
            return {
              label: item.name,
              idsegments: item.idsegments
            };
          })}
          onChange={(e: React.BaseSyntheticEvent, item: any) => {
            if (item) {
              setSegment(item.idsegments);
              setSegmentSelected(item.label);
            } else {
              setSegment(null);
            }
          }}
          style={{
            margin: "5px 0"
          }}
          value={segmentSelected}
        />
      ) : null}
      <TextFieldMultiline
        label="Observação"
        value={note}
        fnChange={(e: React.BaseSyntheticEvent) => {
          setNote(e.target.value);
        }}
        rows={4}
      />
      <div className="inline">
        <button
          className="btn btn-secondary col p-2 mt-2 mr-1 font-weight-bold"
          onClick={async (e: React.SyntheticEvent) => {
            clearFields();
          }}
        >
          Limpar Campos
        </button>
        <button
          className="btn btn-primary col p-2 mt-2 ml-1 font-weight-bold"
          onClick={async (e: React.SyntheticEvent) => {
            const result = await props.requestClient({
              event: e,
              idclients,
              name,
              email,
              phone,
              address,
              addressNumber,
              note,
              idsegment: segment
            });

            if (result.success) {
              clearFields();
            }
          }}
        >
          {props.edit ? "Salvar" : "Criar"}
        </button>
      </div>

      <div className="mt-3">{props.alert}</div>
    </div>
  );
}
