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
import { Clients } from "./pages/clients/Clients";
import { ClientService } from "./service/client-service";
import { InfoClients } from "./pages/clients/InfoClients";
import { CreateClient } from "./pages/clients/CreateClient";
import { WhatsAppService } from "./service/whatsapp";
import { EditClient } from "./pages/clients/EditClient";
import { Segment } from "./pages/Segment";
import { SegmentService } from "./service/segment";
import { CreateSales } from "./pages/sales/CreateSales";
import { SalesService } from "./service/sales";
import { Sales } from "./pages/sales/Sales";
import { Schedules } from "./pages/schedules/Schedule";
import { CreateSchedule } from "./pages/schedules/CreateSchedule";
import { ScheduleService } from "./service/schedule";
import { ScheduleHistory } from "./pages/schedules/History";
import { SalesReports } from "./pages/reports/SalesReports";

export function RoutesApp() {
  const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
  const LOCAL_STORAGE_LOGIN_KEY = process.env
    .REACT_APP_LOCAL_STORAGE_KEY as string;

  const loginService = new LoginService(API_RV_BASE_URI);
  const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);
  const clientService = new ClientService(API_RV_BASE_URI, localStorageService);
  const whatsAppService = new WhatsAppService();
  const segmentService = new SegmentService(
    API_RV_BASE_URI,
    localStorageService
  );
  const salesService = new SalesService(API_RV_BASE_URI, localStorageService);
  const scheduleService = new ScheduleService(
    API_RV_BASE_URI,
    localStorageService
  );

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
                <Clients
                  clientService={clientService}
                  whatsAppService={whatsAppService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/info-client/:clientId"
            element={
              <PrivateRoute>
                {navBar}
                <InfoClients salesService={salesService}/>
              </PrivateRoute>
            }
          />
          <Route
            path="/create-client"
            element={
              <PrivateRoute>
                {navBar}
                <CreateClient
                  clientService={clientService}
                  segmentService={segmentService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-client/:clientId"
            element={
              <PrivateRoute>
                {navBar}
                <EditClient
                  clientService={clientService}
                  segmentService={segmentService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/segments"
            element={
              <PrivateRoute>
                {navBar}
                <Segment segmentService={segmentService} />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                {navBar}
                <Sales
                  salesService={salesService}
                  clientService={clientService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-sale"
            element={
              <PrivateRoute>
                {navBar}
                <CreateSales
                  clientService={clientService}
                  salesService={salesService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-reports"
            element={
              <PrivateRoute>
                {navBar}
                <SalesReports
                  // clientService={clientService}
                  salesService={salesService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <PrivateRoute>
                {navBar}
                <Schedules
                  clientService={clientService}
                  scheduleService={scheduleService}
                  whatsAppService={whatsAppService}
                  salesService={salesService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-schedule"
            element={
              <PrivateRoute>
                {navBar}
                <CreateSchedule
                  clientService={clientService}
                  scheduleService={scheduleService}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule-history"
            element={
              <PrivateRoute>
                {navBar}
                <ScheduleHistory scheduleService={scheduleService} />
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
