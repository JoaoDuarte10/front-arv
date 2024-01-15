import React from 'react';

import { Breadcumb } from '../../components/Breadcumb';
import { ContainerMain } from '../../components/containers/ContainerMain';
import EnhancedTable from '../../components/table/TableListResources';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { useRules } from './hooks/useRules';
import { useNavigate } from 'react-router-dom';

export function Rules() {
  const pageName = 'Permissões';
  const { resources } = useRules();

  const navigate = useNavigate();

  const breadCumbLinks = [{ link: false, name: pageName }];

  return (
    <ContainerMain>
      <Breadcumb page={breadCumbLinks} />
      <TitlePrincipal title={pageName} />

      <EnhancedTable
        headCells={[
          {
            id: 'permission',
            disablePadding: false,
            label: 'Permissão',
            numeric: false,
          },
          {
            id: 'description',
            disablePadding: false,
            label: 'Descrição',
            numeric: false,
          },
          {
            id: 'hasActive',
            disablePadding: false,
            label: 'Ativa',
            numeric: false,
          },
        ]}
        rows={
          (resources &&
            resources.map(resource => ({
              id: resource.idRules,
              columns: {
                name: resource.name,
                description: resource.description,
                active: resource.hasActive ? 'Sim' : 'Não',
              },
              handleClick: () => navigate('/create-outgoing'),
            }))) ||
          []
        }
      />
    </ContainerMain>
  );
}
