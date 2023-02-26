import React, { useEffect, useState } from "react";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { Breadcumb } from "../../components/Breadcumb";
import { TIMEOUT } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { ReduceStore } from "../../app/store";
import { SegmentService } from "../../service/api/segment/segment";
import { SegmentInterface } from "../../service/api/segment/types";
import { segmentAdded } from "../../reducers/segment-sclice";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { useClientForm } from "./hook/useClientForm";
import { GenericButton } from "../../components/buttons/GenericButton";
import { ContainerCardWhite } from "../../components/containers/ContainerCardWhite";
import { DivInline } from "../../components/containers/DivInline";
import ComboBoxList, {
  Option
} from "../../components/inputs/InputAutocompleteList";
import InputMaskNumber from "../../components/inputs/InputMaskNumber";
import InputMaskPhone from "../../components/inputs/InputMaskPhone";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import { ColorsBootstrap } from "../../components/modal/GenericModal";

export function ClientCreateUpdate(props: { segmentService: SegmentService }) {
  const {
    formData,
    handleChangeValue,
    handleSubmit,
    isEditing,
    handleClearFormData,
    loading,
    setLoading,
    alert,
    setAlert
  } = useClientForm();

  const { segmentService } = props;

  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const [segments, setSegments] = useState<SegmentInterface[]>([]);

  const titlePage = isEditing ? "Editar Cliente" : "Novo Cliente";

  const dispatch = useDispatch();

  const getSegments = async () => {
    setLoading(true);
    const { data } = await segmentService.getAll();
    setLoading(false);

    dispatch(segmentAdded(data));
    setSegments(data);
  };

  useEffect(() => {
    if (!segmentCache.length) {
      getSegments();
    } else {
      setSegments(segmentCache);
    }
  }, []);

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <ContainerMain>
      {loading ? <CircularIndeterminate /> : null}

      <Breadcumb
        page={[
          { link: "/clients", name: "Clientes" },
          { link: false, name: titlePage }
        ]}
      />
      <TitlePrincipal title={titlePage} />

      <ContainerCardWhite>
        <div className="pb-2">
          <small className="font-weight-bold">
            Os campos que possuem " * " são obrigatórios!
          </small>
        </div>
        <FullWidthTextField
          label="Nome*"
          value={formData.name}
          fnChange={handleChangeValue("name")}
          disabled={loading}
          error={isEditing && !formData.name}
        />
        <FullWidthTextField
          label="E-mail"
          value={formData.email}
          fnChange={handleChangeValue("email")}
          disabled={loading}
        />
        <InputMaskPhone
          label="Celular*"
          value={formData.phone}
          fnChange={(e: React.BaseSyntheticEvent) =>
            handleChangeValue("phone")(e.target.value)
          }
        />
        <div className="row">
          <div className="col-8">
            <FullWidthTextField
              label="Endereço"
              value={formData.address}
              fnChange={handleChangeValue("address")}
              disabled={loading}
            />
          </div>
          <div className="col-4">
            <InputMaskNumber
              label="Número"
              value={formData.addressNumber || ""}
              fnChange={(e: React.BaseSyntheticEvent) =>
                handleChangeValue("addressNumber")(e.target.value)
              }
            />
          </div>
        </div>
        {segments.length ? (
          <ComboBoxList
            label="Selecionar segmento"
            options={segments.map(item => {
              return {
                label: item.name,
                value: item.idsegments
              };
            })}
            onChange={(e: React.BaseSyntheticEvent, item: Option<number>) => {
              if (item && item.label && item.value) {
                handleChangeValue("segment")(item.label);
                handleChangeValue("idsegment")(item.value);
              }
            }}
            style={{
              margin: "5px 0"
            }}
            value={formData.segment}
          />
        ) : null}
        <TextFieldMultiline
          label="Observação"
          value={formData.note}
          fnChange={(e: React.BaseSyntheticEvent) =>
            handleChangeValue("note")(e.target.value)
          }
          rows={4}
        />
        <DivInline className="mt-2">
          <div className="col">
            <GenericButton
              text="Limpar"
              color={ColorsBootstrap.secondary}
              onClick={(e: React.SyntheticEvent) => handleClearFormData()}
            />
          </div>
          <div className="col">
            <GenericButton
              text={isEditing ? "Salvar" : "Criar"}
              color={ColorsBootstrap.primary}
              onClick={(e: React.BaseSyntheticEvent) => handleSubmit()}
            />
          </div>
        </DivInline>

        <div className="mt-2">{alert}</div>
      </ContainerCardWhite>
    </ContainerMain>
  );
}
