import { configureStore } from "@reduxjs/toolkit";
import authenticatedReducer from "../reducers/authenticated-slice";

export const store = configureStore({
  reducer: {
    authenticated: authenticatedReducer
    //   [apiSlice.reducerPath]: apiSlice.reducer,
    //   schedule: scheduleReducer,
    //   sales: salesReducer,
  }
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
});
