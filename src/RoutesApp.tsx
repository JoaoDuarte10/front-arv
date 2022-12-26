import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { LoginService } from "./service/login";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { PrivateRoute } from "./private-route";
import { Home } from "./pages/Home";
import { NavBarResponsive } from "./components/NavBar";
import { LocalStorageService } from "./service/local-storage";
import { RulesService } from "./service/rules";
import { Clients } from "./pages/Clients";
import { ClientService } from "./service/client-service";
import { InfoClients } from "./pages/InfoClients";

export function RoutesApp() {
  const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
  const LOCAL_STORAGE_LOGIN_KEY = process.env
    .REACT_APP_LOCAL_STORAGE_KEY as string;

  const loginService = new LoginService(API_RV_BASE_URI);
  const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);
  const clientService = new ClientService(API_RV_BASE_URI, localStorageService);

  const navBar = (
    <NavBarResponsive
      localStorageService={localStorageService}
      ruleService={new RulesService(localStorageService)}
    />
  );

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<Login loginService={loginService} />}
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                {navBar}
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                {navBar}
                <Clients clientService={clientService} />
              </PrivateRoute>
            }
          />
          <Route
            path="/info-client/:clientId"
            element={
              <PrivateRoute>
                {navBar}
                <InfoClients />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PrivateRoute>
                {navBar}
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
