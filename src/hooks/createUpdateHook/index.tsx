import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NEW_RESOURCE_KEY } from "../../RoutesApp";
import { CreateUpdateProps } from "./types";
import { AlertServerError } from "../../components/alerts/AlertServerError";
import { AlertSuccess } from "../../components/alerts/AlertSuccess";

export const createUpdateHookTemplate = <FD, DT extends FD>(
  params: CreateUpdateProps<FD, DT>
) => {
  return (
    customParams: {
      isEditing?: boolean;
      id?: number;
    } = {}
  ) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FD>(params.initialFormData);
    const [baseFormData, setBaseFormData] = useState<DT>(
      params.initialFormData
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
      value: FD[T]
    ) => {
      setFormData(state => (state ? { ...state, [field]: value } : state));
    };

    useEffect(() => {
      const fetchDetails = async () => {
        if (!isEditing) return;

        setLoading(true);

        const { success, data } = await params.services.getDetails(Number(id));

        if (success) {
          setBaseFormData(data);
          setFormData(data);
        }

        setLoading(false);
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

      const { success, error } = await params.services.create(customFormData);

      if (success) {
        setFormData(params.initialFormData);
        setAlert(<AlertSuccess title={params.texts.create.success} />);
      }

      if (error) {
        setAlert(<AlertServerError />);
      }

      setLoading(false);
    };

    const handleUpdate = async (customFormData = formData) => {
      setLoading(true);

      const { success, error } = await params.services.edit(customFormData);

      if (success) {
        setFormData(params.initialFormData);
        navigate(-1);
      }

      if (error) {
        setAlert(<AlertServerError />);
      }

      setLoading(false);
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
      setAlert
    };
  };
};
