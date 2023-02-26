import React, { useEffect, useState } from "react";

import { ListHookProps } from "./types";

export const listHookTemplate = <LT = any,>(params: ListHookProps<LT>) => {
  return () => {
    const [resources, setResources] = useState<LT[]>([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<JSX.Element | null>(null);

    const fetchResources = async () => {
      setLoading(true);
      const { success, data } = await params.fetchAll();

      if (success) {
        setResources(data);
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
