import React, { useState } from 'react';
import { Breadcumb } from '../../components/Breadcumb';
import { TitlePrincipal } from '../../components/titles/TitlePrincipal';
import { SegmentService } from '../../service/api/segment/segment';
import { ButtonFilterAction } from '../../components/buttons/ButtonFilterAction';
import { CardSegment } from '../../components/CardSegment';
import { format } from 'date-fns';
import { ContainerMain } from '../../components/containers/ContainerMain';
import { CircularIndeterminate } from '../../components/loaders/CircularLoader';
import { randomId } from '../../utils/random';
import { useSegment } from './hooks/useSegment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { BasicPopover, SelectorPoppover } from '../../components/popover';
import { DeleteResourceModal } from '../../components/modal/DeleteResourceModal';

type InputProps = {
  segmentService: SegmentService;
};

export function Segment(props: InputProps) {
  const hookData = useSegment();

  const {
    segments,
    alert,
    loader,
    onAddNewSegment,
    updateSegmentRequest,
    onDeleteSegment,
    setTitleCardSegment,
    setActionName,
    setEditSegment,
    editSegment,
    titleCardSegment,
    actionName,
    editSegmentName,
    setEditSegmentName,
    setSegmentWithDelete,
    openEditModal,
    setOpenEditModal,
  } = hookData;

  return (
    <ContainerMain>
      <CircularIndeterminate open={loader} />

      <Breadcumb page={[{ link: false, name: 'Segmentos' }]} />
      <TitlePrincipal title="Segmentos" />

      <ButtonFilterAction
        onClick={(e: React.BaseSyntheticEvent) => {
          const filterBySegmentElement = document.getElementById(
            'searchBySegment',
          );
          if (filterBySegmentElement)
            filterBySegmentElement.style.display = 'none';

          setTitleCardSegment('Novo');
          setActionName('Criar');
          setEditSegment(false);
        }}
        text="Novo"
        className="pl-3 pr-3 mb-2"
        dataToggle="modal"
        dataTarget="modalSegment"
      />

      {alert}

      <CardSegment
        editSegment={editSegment as any}
        title={titleCardSegment}
        actionName={actionName}
        segment={editSegmentName}
        clearStates={(e: React.BaseSyntheticEvent) =>
          setEditSegmentName({} as any)
        }
        actionCreate={(e: React.BaseSyntheticEvent, segment: any) =>
          onAddNewSegment(e, segment)
        }
        actionUpdate={updateSegmentRequest}
        setNewSegment={setEditSegmentName}
      />

      {/* <CustomizedSnackbars /> */}

      {segments.length && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead color="#0275d8">
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Criado em</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {segments.map(segment => (
                <TableRow
                  key={segment.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {segment.name}
                  </TableCell>
                  <TableCell align="right">
                    {format(
                      new Date(segment.createdAt.replace('Z', '')),
                      "dd/MM/yyyy 'às' HH:mm'h'",
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <BasicPopover
                      key={randomId()}
                      actions={[
                        {
                          selector: SelectorPoppover.edit,
                          handleSubmit: () => {
                            setTitleCardSegment('Editar');
                            setActionName('Salvar');
                            setEditSegmentName(segment);
                            setEditSegment(true);
                          },
                          dataToggle: 'modal',
                          dataTarget: '#modalSegment',
                        },
                        {
                          selector: SelectorPoppover.delete,
                          handleSubmit: () => {
                            setSegmentWithDelete(segment.idsegments);
                            setOpenEditModal(true);
                          },
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <DeleteResourceModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(!openEditModal)}
        onChange={onDeleteSegment}
      />
    </ContainerMain>
  );
}
