import React, { useState, useEffect } from "react";
import FullWidthTextField from "./inputs/TextFieldFullWidth";
import InputMaskPhone from "./inputs/InputMaskPhone";
import InputMaskNumber from "./inputs/InputMaskNumber";
import TextFieldMultiline from "./inputs/TextFieldMultiline";
import { ClientsInterface } from "../pages/clients/Clients";
import { ComboBox } from "./ComboBox";
import { SegmentInterface } from "../service/segment";
import ComboBoxList from "./inputs/InputAutocompleteList";
import { ContainerCardWhite } from "./divs/ContainerCardWhite";
import { DivInline } from "./divs/DivInline";

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
    <ContainerCardWhite>
      <div className="pb-2">
        <small className="font-weight-bold">
          Os campos que possuem " * " são obrigatórios!
        </small>
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
      <DivInline className="mt-2">
        <div className="col">
          <button
            className="btn btn-secondary col font-weight-bold"
            onClick={async (e: React.SyntheticEvent) => {
              clearFields();
            }}
          >
            Limpar Campos
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-primary col font-weight-bold"
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
      </DivInline>

      <div className="mt-2">{props.alert}</div>
    </ContainerCardWhite>
  );
}
