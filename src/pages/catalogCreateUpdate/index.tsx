import React from "react";

import { Breadcumb } from "../../components/Breadcumb";
import { GenericButton } from "../../components/buttons/GenericButton";
import { ContainerCardWhite } from "../../components/containers/ContainerCardWhite";
import { ContainerMain } from "../../components/containers/ContainerMain";
import { DivInline } from "../../components/containers/DivInline";
import ComboBoxList from "../../components/inputs/InputAutocompleteList";
import InputMaskNumber from "../../components/inputs/InputMaskNumber";
import InputMaskPhone from "../../components/inputs/InputMaskPhone";
import FullWidthTextField from "../../components/inputs/TextFieldFullWidth";
import TextFieldMultiline from "../../components/inputs/TextFieldMultiline";
import { CircularIndeterminate } from "../../components/loaders/CircularLoader";
import { ColorsBootstrap } from "../../components/modal/GenericModal";
import { TitlePrincipal } from "../../components/titles/TitlePrincipal";
import { useCatalogForm } from "./hooks/useCatalogForm";
import { mask } from "../../utils/mask-money";

export function CatalogsCreateUpdate() {
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
  } = useCatalogForm();

  const titlePage = isEditing ? "Editar Serviço" : "Novo Serviço";

  return (
    <ContainerMain>
      {loading ? <CircularIndeterminate /> : null}

      <Breadcumb
        page={[
          { link: "/catalogs", name: "Serviços" },
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
        <TextFieldMultiline
          label="Descrição*"
          value={formData.description}
          fnChange={(e: React.BaseSyntheticEvent) => {
            handleChangeValue("description")(e.target.value);
          }}
          disabled={loading}
          rows={3}
        />
        <FullWidthTextField
          label="Preço*"
          value={formData.price || ""}
          customChange={(e: React.BaseSyntheticEvent) => {
            let val = e.target.value;
            const { maskedValue } = mask(val, 2, ",", ".", false, "R$");
            handleChangeValue("price")(maskedValue);
          }}
          disabled={loading}
        />
        {/* <div className="row">
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
        </div> */}
        {/* <TextFieldMultiline
          label="Observação"
          value={formData.note}
          fnChange={(e: React.BaseSyntheticEvent) =>
            handleChangeValue("note")(e.target.value)
          }
          rows={4}
        /> */}
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
