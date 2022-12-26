import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "../reducers/clients-slice";
import { ClientsInterface } from "../pages/Clients";
import authenticatedReducer, {
  UserLogin
} from "../reducers/authenticated-slice";

export const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer,
    client: clientReducer
  }
});

export type ReduceStore = {
  authenticated: UserLogin;
  client: ClientsInterface[];
};
