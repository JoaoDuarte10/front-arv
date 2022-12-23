import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { LoginService } from "./service/login";
import { Provider } from "react-redux";
import { store } from "./app/store";

export function RoutesApp() {
  const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;

  const loginService = new LoginService(API_RV_BASE_URI);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login loginService={loginService} />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
