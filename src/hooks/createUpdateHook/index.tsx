import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NEW_RESOURCE_KEY } from '../../RoutesApp';
import { CreateUpdateProps } from './types';
import { AlertServerError } from '../../components/alerts/AlertServerError';
import { AlertSuccess } from '../../components/alerts/AlertSuccess';
import { AlertInfo } from '../../components/alerts/AlertInfo';

export const createUpdateHookTemplate = <FD, DT extends FD>(
  params: CreateUpdateProps<FD, DT>,
) => {
  return (
    customParams: {
      isEditing?: boolean;
      id?: number;
    } = {},
  ) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FD>(params.initialFormData);
    const [baseFormData, setBaseFormData] = useState<DT>(
      params.initialFormData,
    );
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<JSX.Element | null>(null);

    const urlParams = useParams<{ id: string }>();

    const id = customParams.id ? customParams.id : urlParams.id;

    const isEditing = customParams.isEditing
      ? customParams.isEditing
      : id
      ? id !== NEW_RESOURCE_KEY
      : false;

    const handleChangeValue = <T extends keyof FD>(field: T) => (
      value: FD[T],
    ) => {
      setFormData(state => (state ? { ...state, [field]: value } : state));
    };

    useEffect(() => {
      const fetchDetails = async () => {
        if (!isEditing) return;

        setLoading(true);

        const {
          success,
          data,
          unauthorized,
        } = await params.services.getDetails(Number(id));

        setLoading(false);

        if (success) {
          setBaseFormData(data);
          setFormData(data);
        }

        if (unauthorized) {
          navigate('/login', { replace: true });
        }
      };

      fetchDetails();
    }, [id, isEditing]);

    const handleSubmit = async (customFormData?: FD) => {
      if (isEditing) {
        return await handleUpdate(customFormData);
      }

      return await handleCreate(customFormData);
    };

    const handleCreate = async (customFormData = formData) => {
      setLoading(true);

      const {
        success,
        error,
        badRequest,
        conflict,
        message,
        unauthorized,
      } = await params.services.create(customFormData);

      setLoading(false);

      if (success) {
        setFormData(params.initialFormData);
        setAlert(<AlertSuccess title={params.texts.create.success} />);
      }

      if (badRequest || conflict) {
        setAlert(<AlertInfo title={message || params.texts.create.error} />);
      }

      if (error) {
        setAlert(
          <AlertServerError title={message || params.texts.create.error} />,
        );
      }

      if (unauthorized) {
        navigate('/login', { replace: true });
      }
    };

    const handleUpdate = async (customFormData = formData) => {
      setLoading(true);

      const {
        success,
        error,
        badRequest,
        conflict,
        message,
        unauthorized,
      } = await params.services.edit(customFormData);

      setLoading(false);

      if (success) {
        setFormData(params.initialFormData);
        navigate(-1);
      }

      if (badRequest || conflict) {
        setAlert(<AlertInfo title={message || params.texts.create.error} />);
      }

      if (error) {
        setAlert(
          <AlertServerError title={message || params.texts.create.error} />,
        );
      }

      if (unauthorized) {
        navigate('/login', { replace: true });
      }
    };

    const handleClearFormData = () => {
      setFormData(params.initialFormData);
    };

    return {
      formData,
      setFormData,
      handleChangeValue,
      loading,
      setLoading,
      isEditing,
      baseFormData,
      id,
      handleSubmit,
      handleClearFormData,
      alert,
      setAlert,
    };
  };
};
