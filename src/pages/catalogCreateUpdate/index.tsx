import React from 'react';

import { Breadcumb } from '../../components/Breadcumb';
import { GenericButton } from '../../components/buttons/GenericButton';
import { ContainerCardWhite } from '../../components/containers/ContainerCardWhite';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { DivInline } from '../../components/containers/DivInline';
import FullWidthTextField from '../../components/inputs/TextFieldFullWidth';
import TextFieldMultiline from '../../components/inputs/TextFieldMultiline';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { ColorsBootstrap } from '../../components/modal/GenericModal';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { useCatalogForm } from './hooks/useCatalogForm';
import { mask } from '../../utils/mask-money';
import { TimeInput } from '../../components/time';

export function CatalogsCreateUpdate() {
  const {
    formData,
    handleChangeValue,
    handleSubmit,
    isEditing,
    handleClearFormData,
    loading,
    alert,
  } = useCatalogForm();

  const titlePage = isEditing ? 'Editar Serviço' : 'Novo Serviço';

  return (
    <ContainerMain>
      <CircularIndeterminate open={loading} />

      <Breadcumb
        page={[
          { link: '/catalogs', name: 'Serviços' },
          { link: false, name: titlePage },
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
          fnChange={handleChangeValue('name')}
          disabled={loading}
          error={isEditing && !formData.name}
        />
        <TextFieldMultiline
          label="Descrição*"
          value={formData.description}
          fnChange={(e: React.BaseSyntheticEvent) => {
            handleChangeValue('description')(e.target.value);
          }}
          disabled={loading}
          rows={3}
        />
        <DivInline>
          <div className="col">
            <FullWidthTextField
              label="Preço*"
              value={formData.price || ''}
              customChange={(e: React.BaseSyntheticEvent) => {
                let val = e.target.value;
                const { maskedValue } = mask(val, 2, ',', '.', false, 'R$');
                handleChangeValue('price')(maskedValue);
              }}
              disabled={loading}
            />
          </div>
          <div className="col">
            <TimeInput
              value={((formData.duration as unknown) as Date) || ''}
              setValue={handleChangeValue('duration')}
              label="Tempo de duração"
            />
          </div>
        </DivInline>

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
              text={isEditing ? 'Salvar' : 'Criar'}
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
