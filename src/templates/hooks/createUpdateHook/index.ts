import { useState } from "react";
import { useParams } from "react-router-dom";

import { Props } from "./types";
import { ValidationResult } from "../../../service/validator/types";
import { useIsMounted } from "../../../hooks/useIsMounted";

export const createUpdateHookTemplate = <FD, DT extends FD>(
  params: Props<FD, DT>
) => {
  return (
    customParams: {
      isEditing?: boolean;
      id?: number;
      validateForm?: (params: FD) => Promise<ValidationResult>;
    } = {}
  ) => {
    const [formData, setFormData] = useState<FD>(params.initialFormData);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationResult["errors"]>(
      () => null
    );

    const urlParams = useParams<{ id: string }>();

    const id = customParams.id ?? urlParams.id;

    const isEditing = customParams.isEditing || false;

    const mounted = useIsMounted();

    const handleChangeValue = <T extends keyof FD>(field: T) => (
      value: FD[T]
    ): void => {
      setFormData(state => (state ? { ...state, [field]: value } : state));
    };

    const handleSubmit = async (
      customFormData?: FD,
      customIsValid?: boolean
    ) => {
      if (isEditing) {
        return await handleUpdate(customFormData, {
          customIsValid
        });
      }

      return await handleCreate(customFormData, {
        customIsValid
      });
    };

    const handleCreate = async (
      customFormData = formData,
      props: {
        customIsValid?: boolean;
      } = {}
    ): Promise<
      { title: string; description: string } | { title: string } | void
    > => {
      const { customIsValid = true } = props;

      setLoading(true);

      const formValidation = customParams.validateForm
        ? await customParams.validateForm(customFormData)
        : await params.validateForm(customFormData);

      if (!formValidation.isValid || !customIsValid) {
        const errorParams = params.texts.create.validate?.(
          formData,
          formValidation
        ) || { title: "Preencha os dados do formulário corretamente" };

        console.info({ validation: formValidation, form: customFormData });

        setErrors(formValidation.errors);
        return errorParams;
      }

      const { success, error, message } = await params.services.create(
        customFormData
      );

      if (mounted.current) setLoading(false);

      if (success) {
        return params.texts.create.success();
      }

      if (error) {
        return {
          title: params.texts.create.error(message).title,
          description: params.texts.create.error(error).description
        };
      }
    };

    const handleUpdate = async (
      customFormData = formData,
      props: {
        customIsValid?: boolean;
      } = {}
    ): Promise<
      { title: string; description: string } | { title: string } | void
    > => {
      const { customIsValid = true } = props;

      setLoading(true);

      const formValidation = customParams.validateForm
        ? await customParams.validateForm(customFormData)
        : await params.validateForm(customFormData);

      if (!formValidation.isValid || !customIsValid) {
        const errorParams = params.texts.create.validate?.(
          formData,
          formValidation
        ) || { title: "Preencha os dados do formulário corretamente" };

        console.info({ validation: formValidation, form: customFormData });

        setErrors(formValidation.errors);
        return errorParams;
      }

      const { success, error, message } = await params.services.update(
        id as number,
        customFormData
      );

      if (mounted.current) setLoading(false);

      if (success) {
        return params.texts.create.success();
      }

      if (error) {
        return {
          title: params.texts.create.error(message).title,
          description: params.texts.create.error(error).description
        };
      }
    };

    return {
      formData,
      setFormData,
      handleChangeValue,
      handleCreate,
      handleUpdate,
      loading,
      setLoading,
      isEditing,
      handleSubmit,
      id,
      errors,
      setErrors
    };
  };
};
