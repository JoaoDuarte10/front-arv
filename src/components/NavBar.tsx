import React, { useEffect, useState } from "react";
import "../css/main.css";
import { useNavigate, redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduceStore } from "../app/store";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import Collapse from "@mui/material/Collapse";
import { LocalStorageService } from "../service/local-storage";
import { RulesService } from "../service/rules";

export function NavBarResponsive(props: {
  localStorageService: LocalStorageService;
  ruleService: RulesService;
}) {
  const { localStorageService, ruleService } = props;
  const navigate = useNavigate();

  const [openSales, setOpenSales] = useState<boolean>(false);
  const [openClients, setOpenClients] = useState<boolean>(false);
  const [openSchedules, setOpenSchedules] = useState<boolean>(false);
  const [openResponsive, setOpenResponsive] = useState<boolean>(false);

  const closeItens = () => {
    setOpenSales(false);
    setOpenClients(false);
    setOpenSchedules(false);
    closeNavResponsive();
  };

  const closeNavResponsive = () => {
    const navGroupElement = document.getElementById("navGroup");

    if (navGroupElement) {
      if (navGroupElement.className === "nav-group")
        navGroupElement.className += "-responsive";
      else navGroupElement.className = "nav-group";
    }
  };

  const rulesStorage = useSelector((state: ReduceStore) => state.authenticated)
    .rules;

  const [rules, setRules] = useState<string[]>([]);

  useEffect(() => {
    setRules(rulesStorage);
  });

  return (
    <div id="navbarresponsive">
      <div className="title-navbar-responsive">
        <h5 id="title-navbar">
          <strong>ARV Controll</strong>
        </h5>
        <div
          className="nav-icon"
          onClick={e => {
            closeNavResponsive();
            setOpenResponsive(!openResponsive);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="white"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </div>
      </div>

      <ul className="nav-group" id="navGroup">
        <li className="nav-item remove-style-link" key="984513">
          <button
            className="btn-list-item"
            onClick={e => {
              closeNavResponsive();
              navigate("/home");
            }}
            style={{ outline: "none" }}
          >
            Home
          </button>
        </li>
        {rules.includes(ruleService.ruleWithPage("schedule")) && (
          <li className="nav-item remove-style-link" key="8979951462">
            <button
              className="btn-list-item"
              style={{ outline: "none" }}
              onClick={e => setOpenSchedules(!openSchedules)}
            >
              Agenda
              {openSchedules ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openSchedules} timeout="auto" unmountOnExit>
              <li className="sub-item" data-dismiss="modal" key="2369874">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/create-schedule");
                  }}
                  style={{ outline: "none" }}
                >
                  Nova Agenda
                </button>
              </li>
              <li className="sub-item" data-dismiss="modal" key="278534">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/schedules");
                  }}
                  style={{ outline: "none" }}
                >
                  Suas Agendas
                </button>
              </li>
              <li className="sub-item" data-dismiss="modal" key="278534">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/schedule-history");
                  }}
                  style={{ outline: "none" }}
                >
                  Histórico
                </button>
              </li>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage("clients")) && (
          <li className="nav-item remove-style-link" key="8795444">
            <button
              className="btn-list-item"
              style={{ outline: "none" }}
              onClick={e => setOpenClients(!openClients)}
            >
              Clientes
              {openClients ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openClients} timeout="auto" unmountOnExit>
              <li className="sub-item" key="33745">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/create-client");
                  }}
                  style={{ outline: "none" }}
                >
                  Novo Cliente
                </button>
              </li>
              <li className="sub-item" key="3345">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/clients");
                  }}
                  style={{ outline: "none" }}
                >
                  Seus Clientes
                </button>
              </li>
              <li className="sub-item" key="434">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/segments");
                  }}
                  style={{ outline: "none" }}
                >
                  Segmentos
                </button>
              </li>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage("sales")) && (
          <li className="nav-item remove-style-link" key="136971">
            <button
              className="btn-list-item"
              style={{ outline: "none" }}
              onClick={e => setOpenSales(!openSales)}
            >
              Vendas
              {openSales ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openSales} timeout="auto" unmountOnExit>
              <li className="sub-item" key="6948">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/create-sale");
                  }}
                  style={{ outline: "none" }}
                >
                  Nova Venda
                </button>
              </li>
              <li className="sub-item" key="3445">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/sales");
                  }}
                  style={{ outline: "none" }}
                >
                  Suas Vendas
                </button>
              </li>
              <li className="sub-item" key="346346">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/sales-reports");
                  }}
                  style={{ outline: "none" }}
                >
                  Relatórios
                </button>
              </li>
            </Collapse>
          </li>
        )}
        <li className="nav-item remove-style-link" key="6644855">
          <a href={process.env.REACT_APP_BASE_URL + '/login'} rel="noopener noreferrer" onClick={e => {
            localStorageService.clearUser();
            closeNavResponsive();
          }}
          className="btn-list-item btn-exit"
          >
            Sair
          </a>
        </li>
      </ul>
    </div>
  );
}
