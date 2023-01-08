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
  const ruleService = new RulesService(localStorageService);

  const navBar = (
    <NavBarResponsive
      localStorageService={localStorageService}
      ruleService={ruleService}
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
              <PrivateRoute rules={[ruleService.ruleWithPage("clients")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("clients")]}>
                {navBar}
                <InfoClients salesService={salesService} />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-client"
            element={
              <PrivateRoute rules={[ruleService.ruleWithPage("clients")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("clients")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("clients")]}>
                {navBar}
                <Segment segmentService={segmentService} />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute rules={[ruleService.ruleWithPage("sales")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("sales")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("sales")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("schedules")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("schedules")]}>
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
              <PrivateRoute rules={[ruleService.ruleWithPage("schedules")]}>
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
