import { configureStore } from "@reduxjs/toolkit";
import authenticatedReducer, {
  UserLogin
} from "../reducers/authenticated-slice";

export const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer
  }
});

export type ReduceStore = {
  authenticated: UserLogin;
};
