import React, { useEffect, useState } from 'react';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { Breadcumb } from '../../components/Breadcumb';
import { TIMEOUT } from '../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { ReduceStore } from '../../app/store';
import { SegmentService } from '../../service/api/segment/segment';
import { SegmentInterface } from '../../service/api/segment/types';
import { segmentAdded } from '../../reducers/segment-sclice';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { useClientForm } from './hook/useClientForm';
import { GenericButton } from '../../components/buttons/GenericButton';
import { ContainerCardWhite } from '../../components/containers/ContainerCardWhite';
import { DivInline } from '../../components/containers/DivInline';
import ComboBoxList, {
  Option,
} from '../../components/inputs/InputAutocompleteList';
import InputMaskNumber from '../../components/inputs/InputMaskNumber';
import InputMaskPhone from '../../components/inputs/InputMaskPhone';
import FullWidthTextField from '../../components/inputs/TextFieldFullWidth';
import TextFieldMultiline from '../../components/inputs/TextFieldMultiline';
import { ColorsBootstrap } from '../../components/modal/GenericModal';
import { Typography } from '@mui/material';
import InputMaskCep from '../../components/inputs/InputMaskCep';
import InputMaskCPF from '../../components/inputs/InputMaskCPF';
import InputMaskCNPJ from '../../components/inputs/InputMaskCNPJ';

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
    setAlert,
    handleChangeAddress,
  } = useClientForm();

  const { segmentService } = props;

  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const [segments, setSegments] = useState<SegmentInterface[]>([]);

  const titlePage = isEditing ? 'Editar Cliente' : 'Novo Cliente';

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
      <CircularIndeterminate open={loading} />

      <Breadcumb
        page={[
          { link: '/clients', name: 'Clientes' },
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
        <FullWidthTextField
          label="E-mail"
          value={formData.email}
          fnChange={handleChangeValue('email')}
          disabled={loading}
        />
        <InputMaskPhone
          label="Celular"
          value={formData.phone}
          fnChange={(e: React.BaseSyntheticEvent) =>
            handleChangeValue('phone')(e.target.value)
          }
        />

        <DivInline className="mb-1">
          <div className="col-6">
            <InputMaskCPF
              label="CPF"
              value={formData.cpf || ''}
              fnChange={(e: React.BaseSyntheticEvent) =>
                handleChangeValue('cpf')(e.target.value)
              }
              disabled={loading}
            />
          </div>
          <div className="col-6">
            <InputMaskCNPJ
              label="CNPJ"
              value={formData.cnpj || ''}
              fnChange={(e: React.BaseSyntheticEvent) =>
                handleChangeValue('cnpj')(e.target.value)
              }
              disabled={loading}
            />
          </div>
        </DivInline>

        {segments.length ? (
          <ComboBoxList
            label="Selecionar segmento"
            options={segments.map(item => {
              return {
                label: item.name,
                value: item.idsegments,
              };
            })}
            onChange={(e: React.BaseSyntheticEvent, item: Option<number>) => {
              if (item && item.label && item.value) {
                handleChangeValue('segment')(item.label);
                handleChangeValue('idsegment')(item.value);
              }
            }}
            style={{
              margin: '5px 0',
            }}
            value={formData.segment}
            disabled={loading}
          />
        ) : null}

        <Typography variant="h6" className="mt-2 mb-2">
          Endereço
        </Typography>

        <DivInline className="mb-1">
          <div className="col-4">
            <InputMaskCep
              label="CEP"
              value={(formData.address && formData.address.cep) || ''}
              fnChange={(e: React.BaseSyntheticEvent) =>
                handleChangeAddress('cep')(e.target.value)
              }
              disabled={loading}
            />
          </div>
          <div className="col-8">
            <FullWidthTextField
              label="Cidade"
              value={(formData.address && formData.address.city) || ''}
              fnChange={handleChangeAddress('city')}
              disabled={loading}
            />
          </div>
        </DivInline>
        <DivInline className="mb-1">
          <div className="col-8">
            <FullWidthTextField
              label="Endereço"
              value={(formData.address && formData.address.address) || ''}
              fnChange={handleChangeAddress('address')}
              disabled={loading}
            />
          </div>
          <div className="col-4">
            <InputMaskNumber
              label="Número"
              value={(formData.address && formData.address.number) || ''}
              fnChange={(e: React.BaseSyntheticEvent) =>
                handleChangeAddress('number')(e.target.value)
              }
            />
          </div>
        </DivInline>
        <DivInline className="mb-1">
          <div className="col-6">
            <FullWidthTextField
              label="Estado"
              value={(formData.address && formData.address.uf) || ''}
              fnChange={handleChangeAddress('uf')}
              disabled={loading}
            />
          </div>
          <div className="col-6">
            <FullWidthTextField
              label="Bairro"
              value={(formData.address && formData.address.neighborhood) || ''}
              fnChange={handleChangeAddress('neighborhood')}
              disabled={loading}
            />
          </div>
        </DivInline>
        <FullWidthTextField
          label="Complemento"
          value={(formData.address && formData.address.complement) || ''}
          fnChange={handleChangeAddress('complement')}
          disabled={loading}
        />

        <TextFieldMultiline
          label="Observação"
          value={formData.note}
          fnChange={(e: React.BaseSyntheticEvent) =>
            handleChangeValue('note')(e.target.value)
          }
          rows={4}
          className="mt-2"
          disabled={loading}
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
