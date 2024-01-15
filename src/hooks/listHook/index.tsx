import React, { useEffect, useState } from "react";

import { ListHookProps } from "./types";
import { AlertSuccess } from '../../components/alerts/AlertSuccess';
import { AlertServerError } from '../../components/alerts/AlertServerError';

export const listHookTemplate = <LT = any>(params: ListHookProps<LT>) => {
  return () => {
    const [resources, setResources] = useState<LT[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<JSX.Element | null>(null);

    const fetchResources = async () => {
      setLoading(true);

      const { success, data, error, message } = await params.fetchAll();

      if (success) {
        setResources(data);
        setAlert(<AlertSuccess title={params.texts.list.success || "Pesquisa atualizada"} />);
      }

      if (error) {
        setAlert(<AlertServerError title={message || params.texts.list.error}/>);
      }

      setLoading(false);
    };

    useEffect(() => {
      fetchResources();
    }, []);

    return {
      fetchResources,
      resources,
      setResources,
      loading,
      setLoading,
      alert,
      setAlert
    };
  };
};
