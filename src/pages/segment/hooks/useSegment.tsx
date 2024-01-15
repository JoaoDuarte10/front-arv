import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { ReduceStore } from '../../../app/store';
import { useEffect, useState } from 'react';
import { SegmentInterface } from '../../../service/api/segment/types';
import { API_RV_BASE_URI, localStorageService } from '../../../RoutesApp';
import { SegmentService } from '../../../service/api/segment/segment';
import { segmentAdded } from '../../../reducers/segment-sclice';
import { AlertInfo } from '../../../components/alerts/AlertInfo';
import { AlertSuccess } from '../../../components/alerts/AlertSuccess';
import { AlertError } from '../../../components/alerts/AlertError';
import { TIMEOUT } from '../../../utils/constants';
import { useNavigate } from 'react-router-dom';

export const useSegment = () => {
  const segmentCache = useSelector((state: ReduceStore) => state.segment);

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const segmentService = new SegmentService(
    API_RV_BASE_URI,
    localStorageService,
  );

  const [segments, setSegments] = useState<SegmentInterface[]>([]);

  const [titleCardSegment, setTitleCardSegment] = useState<string>('');
  const [actionName, setActionName] = useState<string>('');
  const [editSegmentName, setEditSegmentName] = useState<SegmentInterface>(
    {} as any,
  );
  const [editSegment, setEditSegment] = useState<boolean | null>(null);
  const [segmentWithDelete, setSegmentWithDelete] = useState<number | null>(
    null,
  );

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const [openEditModal, setOpenEditModal] = useState(false);

  const getSegments = async () => {
    setLoader(true);
    const { data, unauthorized } = await segmentService.getAll();
    setLoader(false);

    if (unauthorized) {
      navigate('/login', { replace: true });
      return;
    }

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

  const formFieldsIsValids = (segment: string): boolean => {
    if (!segment || !segment.trim() || segment.length > 50) {
      setAlert(<AlertInfo title="Preencha os campos corretamente." />);
      return false;
    }
    return true;
  };

  const onAddNewSegment = async (
    event: React.BaseSyntheticEvent,
    segment: string,
  ) => {
    event.preventDefault();

    if (!formFieldsIsValids(segment)) return;

    setLoader(true);
    const {
      success,
      conflict,
      error,
      unauthorized,
    } = await segmentService.create(segment);
    setLoader(false);

    if (success) {
      setAlert(<AlertSuccess title="Segmento criado com sucesso." />);
      getSegments();
    }

    if (conflict) {
      setAlert(<AlertInfo title="Esse segmento já existe." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }

    if (unauthorized) {
      navigate('/login', { replace: true });
    }
  };

  const updateSegmentRequest = async (
    event: React.BaseSyntheticEvent,
    segment: SegmentInterface,
  ) => {
    event.preventDefault();

    setLoader(true);
    const {
      success,
      notFound,
      error,
      unauthorized,
    } = await segmentService.update(segment.idsegments, segment.name);
    setLoader(false);

    if (success) {
      setAlert(<AlertSuccess title="Segmento atualizado com sucesso." />);
      getSegments();
      setEditSegmentName({} as any);
    }

    if (notFound) {
      setAlert(<AlertInfo title="Segmento não encontrado." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }

    if (unauthorized) {
      navigate('/login', { replace: true });
    }
  };

  const onDeleteSegment = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    if (!segmentWithDelete) {
      return;
    }

    setLoader(true);
    const {
      success,
      notFound,
      error,
      conflict,
      unauthorized,
    } = await segmentService.delete(segmentWithDelete);
    setLoader(false);

    if (success) {
      setAlert(<AlertSuccess title="Segmento deletado com sucesso." />);
      getSegments();
    }

    if (notFound) {
      setAlert(<AlertInfo title="Segmento não encontrado." />);
    }

    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />,
      );
    }

    if (conflict) {
      setAlert(
        <AlertError title="Não é possível excluir esse segmento pois há clientes associados à ele." />,
      );
    }

    if (unauthorized) {
      navigate('/login', { replace: true });
    }

    setOpenEditModal(false);
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return {
    segments,
    alert,
    loader,
    onAddNewSegment,
    updateSegmentRequest,
    onDeleteSegment,
    setTitleCardSegment,
    setActionName,
    setEditSegment,
    segmentWithDelete,
    editSegment,
    titleCardSegment,
    actionName,
    editSegmentName,
    setEditSegmentName,
    setSegmentWithDelete,
    openEditModal,
    setOpenEditModal,
  };
};
