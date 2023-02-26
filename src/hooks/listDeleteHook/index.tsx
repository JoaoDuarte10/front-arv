import React from "react";
import { Props } from "./types";
import { listHookTemplate } from "../listHook";

export const listDeleteHookTemplate = <LT = any,>(params: Props<LT>) => {
  const useListHook = listHookTemplate<LT>({
    fetchAll: params.services.fetchAll
  });

  return () => {
    const hookData = useListHook();
    const { setLoading } = hookData;

    const handleDeleteResource = async (id: number) => {
      setLoading(true);

      const { success } = await params.services.delete(id);

      if (success) {
        hookData.fetchResources();
      }

      setLoading(false);
    };

    return {
      ...hookData,
      handleDeleteResource
    };
  };
};
