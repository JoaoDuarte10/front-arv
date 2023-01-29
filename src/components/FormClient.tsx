import React, { useState, useEffect } from "react";
import FullWidthTextField from "./inputs/TextFieldFullWidth";
import InputMaskPhone from "./inputs/InputMaskPhone";
import InputMaskNumber from "./inputs/InputMaskNumber";
import TextFieldMultiline from "./inputs/TextFieldMultiline";
import { ClientsInterface } from "../pages/clients/Clients";
import { SegmentInterface } from "../service/segment";
import ComboBoxList from "./inputs/InputAutocompleteList";
import { ContainerCardWhite } from "./divs/ContainerCardWhite";
import { DivInline } from "./divs/DivInline";
import { GenericButton } from "./buttons/GenericButton";
import { ColorsBootstrap } from "./modal/GenericModal";

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
  const { edit, alert, requestClient, client, segments } = props;

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
    if (edit && client) {
      const findSegment: SegmentInterface | undefined = segments.find(
        segment => {
          if (client) return segment.name === client.name;
        }
      );
      if (findSegment) {
        setSegment(findSegment.idsegments);
      }
      setIdClients(client.idclients);
      setName(client.name);
      setEmail(client.email);
      setPhone(client.phone);
      setAddress(client.address);
      setAddressNumber(client.addressnumber);
      setNote(client.note);
      setSegmentSelected(client.segment);
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
      {segments.length ? (
        <ComboBoxList
          label="Selecionar segmento"
          options={segments.map(item => {
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
          <GenericButton
            text="Limpar"
            color={ColorsBootstrap.secondary}
            onClick={(e: React.SyntheticEvent) => {
              clearFields();
            }}
          />
        </div>
        <div className="col">
          <GenericButton
            text={edit ? "Salvar" : "Criar"}
            color={ColorsBootstrap.primary}
            onClick={async (e: React.SyntheticEvent) => {
              const result = await requestClient({
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
          />
        </div>
      </DivInline>

      <div className="mt-2">{alert}</div>
    </ContainerCardWhite>
  );
}
