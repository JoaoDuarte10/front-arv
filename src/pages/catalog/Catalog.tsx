import React from 'react';

import { useCatalog } from './hooks/useCatalog';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { TIMEOUT } from '../../utils/constants';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { DivInline } from '../../components/containers/DivInline';
import { LabelForm } from '../../components/labels/LabelForm';
import { LabelSmall } from '../../components/labels/LabelSmal';
import { randomId } from '../../utils/random';
import { Link } from 'react-router-dom';
import { EditIconButton } from '../../components/buttons/EditIconButton';
import { BasicDeleteModal } from '../../components/modal/BasicDeleteModal';
import { Typography } from '@mui/material';
import { format } from 'date-fns';

export function Catalog() {
  const {
    resources,
    alert,
    setAlert,
    loading,
    handleDeleteResource,
  } = useCatalog();

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  const breadCumbLinks = [
    { link: false, name: 'Serviços' },
    { link: '/catalogs/create', name: 'Novo Serviço' },
  ];

  return (
    <ContainerMain>
      <Breadcumb page={breadCumbLinks} />
      <TitlePrincipal title="Serviços" />

      {alert}

      <CircularIndeterminate open={loading} />

      {resources.length
        ? resources.map(catalog => {
            const durationHour =
              catalog.duration &&
              typeof catalog.duration === 'string' &&
              catalog.duration.split(':')[0];
            const durationMinutes =
              catalog.duration &&
              typeof catalog.duration === 'string' &&
              catalog.duration.split(':')[1];

            return (
              <div
                className="container_catalog"
                key={catalog.idCatalog + randomId()}
              >
                <div
                  className="actions_catalog remove-style-link"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h6
                    style={{
                      fontSize: '1em',
                      color: '#0275d8',
                      fontWeight: 'bold',
                      margin: 0,
                    }}
                  >
                    Detalhes do Serviço
                  </h6>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Link
                      className=""
                      to={`/catalogs/edit/${catalog.idCatalog}`}
                    >
                      <EditIconButton />
                    </Link>
                    <BasicDeleteModal
                      btnName="Excluir"
                      onChange={(e: React.SyntheticEvent) => {
                        handleDeleteResource(catalog.idCatalog as number);
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ color: 'red' }}
                      >
                        Excluir Serviço
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Tem certeza que deseja excluir esse serviço?
                      </Typography>
                    </BasicDeleteModal>
                  </div>
                </div>

                <div className="info_catalogs">
                  <DivInline className="row">
                    <LabelForm
                      text="Nome"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall text={catalog.name} />
                    </LabelForm>
                    <LabelForm
                      text="Preço"
                      className="col-sm-6 pb-2 border-bottom"
                    >
                      <LabelSmall
                        text={Number(catalog.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      />
                    </LabelForm>
                    <LabelForm
                      text="Descrição"
                      className="col-sm-12 pb-2 border-bottom"
                    >
                      <LabelSmall text={catalog.description} />
                    </LabelForm>
                    <LabelForm
                      text="Tempo de Duração"
                      className="col-sm-12 pb-2 border-bottom"
                    >
                      <LabelSmall
                        text={
                          catalog.duration
                            ? `${durationHour}h ${durationMinutes}m`
                            : ''
                        }
                      />
                    </LabelForm>
                    <LabelForm
                      text="Criado em"
                      className="col-sm-12 pb-2 border-bottom"
                    >
                      <LabelSmall
                        text={format(
                          new Date(catalog.createdAt.replace('Z', '')),
                          "dd/MM/yyyy 'às' HH:mm'h'",
                        )}
                      />
                    </LabelForm>
                    {catalog.updatedAt && (
                      <LabelForm text="Atualizado em" className="col-sm-12">
                        <LabelSmall
                          text={format(
                            new Date(catalog.updatedAt.replace('Z', '')),
                            "dd/MM/yyyy 'às' HH:mm'h'",
                          )}
                        />
                      </LabelForm>
                    )}
                  </DivInline>
                </div>
              </div>
            );
          })
        : null}
    </ContainerMain>
  );
}
