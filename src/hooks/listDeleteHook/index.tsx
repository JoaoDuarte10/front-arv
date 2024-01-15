import React from "react";
import { Props } from "./types";
import { listHookTemplate } from "../listHook";
import { AlertSuccess } from '../../components/alerts/AlertSuccess';
import { AlertServerError } from '../../components/alerts/AlertServerError';
import { useNavigate } from "react-router-dom";

export const listDeleteHookTemplate = <LT = any>(params: Props<LT>) => {
  const useListHook = listHookTemplate<LT>({
    fetchAll: params.services.fetchAll,
    texts: params.texts
  });

  return () => {
    const hookData = useListHook();
    const { setLoading, setAlert } = hookData;
    let navigate = useNavigate();

    const handleDeleteResource = async (id: number) => {
      setLoading(true);

      const { success, error, message, unauthorized } = await params.services.delete(id);

      setLoading(false);

      if (success) {
        hookData.fetchResources();
        setAlert(<AlertSuccess title="Deletado com sucesso"/>)
      }

      if (error) {
        setAlert(<AlertServerError title={message || ''}/>)
      }

      if (unauthorized) {
        navigate('/login', { replace: true });
      }
    };

    return {
      ...hookData,
      handleDeleteResource
    };
  };
};
