import React from "react";
import {
  ClientFormData,
  ClientsInterface
} from "../../../service/api/client/types";
import { createUpdateHookTemplate } from "../../../hooks/createUpdateHook";
import {
  createClient,
  editClient,
  fetchClientById
} from "../../../service/api/client/client-service";

const initialFormData: ClientsInterface & ClientFormData = {
  idclients: 0,
  name: "",
  email: "",
  phone: "",
  segment: "",
  idsegment: null,
  addressNumber: null,
  address: "",
  note: "",
  created_at: ""
} as any;

const params = {
  initialFormData,
  services: {
    create: createClient,
    edit: editClient,
    getDetails: fetchClientById
  }
};

export const useHookCreateUpdate = createUpdateHookTemplate<
  ClientFormData,
  ClientsInterface
>(params);

export const useClientForm = () => {
  const hookData = useHookCreateUpdate();

  return {
    ...hookData
  };
};
