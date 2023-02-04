import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { LoginService } from "./service/api/auth/login";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { PrivateRoute } from "./private-route";
import { Home } from "./pages/Home";
import { NavBarResponsive } from "./components/NavBar";
import { LocalStorageService } from "./service/localStorage/local-storage";
import { RulesService } from "./service/api/rules/rules";
import { Clients } from "./pages/clients/Clients";
import { ClientService } from "./service/api/client/client-service";
import { InfoClients } from "./pages/clients/InfoClients";
import { CreateClient } from "./pages/clients/CreateClient";
import { WhatsAppService } from "./service/api/whatsapp/whatsapp";
import { EditClient } from "./pages/clients/EditClient";
import { Segment } from "./pages/Segment";
import { SegmentService } from "./service/api/segment/segment";
import { CreateSales } from "./pages/sales/CreateSales";
import { SalesService } from "./service/api/sales/sales";
import { Sales } from "./pages/sales/Sales";
import { Schedules } from "./pages/schedules/Schedule";
import { CreateSchedule } from "./pages/schedules/CreateSchedule";
import { ScheduleService } from "./service/api/schedule/schedule";
import { ScheduleHistory } from "./pages/schedules/History";
import { SalesReports } from "./pages/reports/SalesReports";
import { OutgoingService } from "./service/api/outgoing/outgoing";
import { Outgoing } from "./pages/outgoing/Outgoing";
import { CreateOutgoing } from "./pages/outgoing/CreateOutgoing";

const API_RV_BASE_URI = process.env.REACT_APP_BASE_URL as string;
const LOCAL_STORAGE_LOGIN_KEY = process.env
  .REACT_APP_LOCAL_STORAGE_KEY as string;

const loginService = new LoginService(API_RV_BASE_URI);
const localStorageService = new LocalStorageService(LOCAL_STORAGE_LOGIN_KEY);
const clientService = new ClientService(API_RV_BASE_URI, localStorageService);
const whatsAppService = new WhatsAppService();
const segmentService = new SegmentService(API_RV_BASE_URI, localStorageService);
const salesService = new SalesService(API_RV_BASE_URI, localStorageService);
const scheduleService = new ScheduleService(
  API_RV_BASE_URI,
  localStorageService
);
const ruleService = new RulesService(localStorageService);
export const outgoingService = new OutgoingService(
  API_RV_BASE_URI,
  localStorageService
);

export function RoutesApp() {
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
                <InfoClients
                  salesService={salesService}
                  clientService={clientService}
                  whatsAppService={whatsAppService}
                />
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
                  outgoingService={outgoingService}
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
                  outgoingService={outgoingService}
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
            path="/create-outgoing"
            element={
              <PrivateRoute rules={[ruleService.ruleWithPage("outgoing")]}>
                {navBar}
                <CreateOutgoing outgoingService={outgoingService} />
              </PrivateRoute>
            }
          />
          <Route
            path="/outgoings"
            element={
              <PrivateRoute rules={[ruleService.ruleWithPage("outgoing")]}>
                {navBar}
                <Outgoing outgoingService={outgoingService} />
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
