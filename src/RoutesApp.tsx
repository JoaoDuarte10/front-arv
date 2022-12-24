import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { LoginService } from "./service/login";
import { Provider, useSelector } from "react-redux";
import { store, ReduceStore } from "./app/store";
import { PrivateRoute } from "./private-route";
import { Home } from "./pages/Home";
import { NavBarResponsive } from "./components/NavBar";
import { LocalStorageService } from "./service/local-storage";
import { RulesService } from "./service/rules";

export function RoutesApp() {
  const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
  const LOCAL_STORAGE_LOGIN_KEY = process.env
    .REACT_APP_LOCAL_STORAGE_KEY as string;

  const loginService = new LoginService(API_RV_BASE_URI);
  const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);

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
                <NavBarResponsive
                  localStorageService={localStorageService}
                  ruleService={new RulesService(localStorageService)}
                />
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <NavBarResponsive
                  localStorageService={localStorageService}
                  ruleService={new RulesService(localStorageService)}
                />
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
