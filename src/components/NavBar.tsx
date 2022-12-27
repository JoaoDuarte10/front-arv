import React, { useEffect, useState } from "react";

/* eslint-disable jsx-a11y/no-redundant-roles */
import "../css/main.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ReduceStore } from "../app/store";

export function NavBarResponsive(props: any) {
  const { localStorageService } = props;
  const { ruleService } = props;
  const navigate = useNavigate();

  const closeItens = () => {
    // const scheduleElement = document.getElementById('sub-group-schedule');
    // const clientElement = document.getElementById('sub-group-client');
    // const salesElement = document.getElementById('sub-group-sales');
    // const atendimentoElement = document.getElementById('sub-group-atendimento');
    // const navGroupElement = document.getElementById('navGroup');

    // if (scheduleElement?.style.display === 'block')
    //   scheduleElement.style.display = 'none';
    // if (clientElement?.style.display === 'block')
    //   clientElement.style.display = 'none';
    // if (salesElement?.style.display === 'block')
    //   salesElement.style.display = 'none';
    // if (atendimentoElement?.style.display === 'block')
    //   atendimentoElement.style.display = 'none';
    // if (navGroupElement?.className === 'nav-group')
    //   navGroupElement.className = 'nav-group';

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

  // const rules = useSelector((state: ReduceStore) => state.authenticated).rules;

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
          <strong>ARV - Controll</strong>
        </h5>
        <div
          className="nav-icon"
          onClick={e => {
            closeNavResponsive();
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
              data-toggle="collapse"
              data-target="#sub-group-schedule"
              aria-expanded="false"
              aria-controls="sub-group-schedule"
            >
              Agenda
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-caret-down"
                viewBox="0 0 16 16"
              >
                <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
              </svg>
            </button>
            <div className="nav-sub-group" id="sub-group-schedule">
              <li className="sub-item" data-dismiss="modal" key="2369874">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/create-schedule");
                  }}
                  style={{ outline: "none" }}
                  data-toggle="collapse"
                  data-target="#sub-group-schedule"
                  aria-expanded="false"
                  aria-controls="sub-group-schedule"
                >
                  Nova Agenda
                </button>
              </li>
              <li className="sub-item" data-dismiss="modal" key="278534">
                <button
                  className="btn-list-sub-item"
                  onClick={e => {
                    closeItens();
                    navigate("/schedule");
                  }}
                  style={{ outline: "none" }}
                  data-toggle="collapse"
                  data-target="#sub-group-schedule"
                  aria-expanded="false"
                  aria-controls="sub-group-schedule"
                >
                  Suas Agendas
                </button>
              </li>
            </div>
          </li>
        )}

        <li className="nav-item remove-style-link" key="3348795">
          <button
            className="btn-list-item"
            style={{ outline: "none" }}
            data-toggle="collapse"
            data-target="#sub-group-atendimento"
            aria-expanded="false"
            aria-controls="sub-group-atendimento"
          >
            Atendimentos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-down"
              viewBox="0 0 16 16"
            >
              <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
            </svg>
          </button>
          <div className="nav-sub-group" id="sub-group-atendimento">
            <li className="sub-item" key="9837458">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/create-history");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-atendimento"
                aria-expanded="false"
                aria-controls="sub-group-atendimento"
              >
                Criar Novo
              </button>
            </li>
            <li className="sub-item" key="83450">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/history");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-atendimento"
                aria-expanded="false"
                aria-controls="sub-group-atendimento"
              >
                Histórico
              </button>
            </li>
          </div>
        </li>

        <li className="nav-item remove-style-link" key="8795444">
          <button
            className="btn-list-item"
            style={{ outline: "none" }}
            data-toggle="collapse"
            data-target="#sub-group-client"
            aria-expanded="false"
            aria-controls="sub-group-client"
          >
            Clientes
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-down"
              viewBox="0 0 16 16"
            >
              <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
            </svg>
          </button>
          <div className="nav-sub-group" id="sub-group-client">
            <li className="sub-item" key="33745">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/create-client");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-client"
                aria-expanded="false"
                aria-controls="sub-group-client"
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
                data-toggle="collapse"
                data-target="#sub-group-client"
                aria-expanded="false"
                aria-controls="sub-group-client"
              >
                Seus Clientes
              </button>
            </li>
            <li className="sub-item" key="434">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/segments-clients");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-client"
                aria-expanded="false"
                aria-controls="sub-group-client"
              >
                Segmentos
              </button>
            </li>
          </div>
        </li>
        <li className="nav-item remove-style-link" key="136971">
          <button
            className="btn-list-item"
            style={{ outline: "none" }}
            data-toggle="collapse"
            data-target="#sub-group-sales"
            aria-expanded="false"
            aria-controls="sub-group-sales"
          >
            Vendas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-caret-down"
              viewBox="0 0 16 16"
            >
              <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z" />
            </svg>
          </button>
          <div className="nav-sub-group" id="sub-group-sales">
            <li className="sub-item" key="6948">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/new-sale");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-sales"
                aria-expanded="false"
                aria-controls="sub-group-sales"
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
                data-toggle="collapse"
                data-target="#sub-group-sales"
                aria-expanded="false"
                aria-controls="sub-group-sales"
              >
                Suas Vendas
              </button>
            </li>
            <li className="sub-item" key="346346">
              <button
                className="btn-list-sub-item"
                onClick={e => {
                  closeItens();
                  navigate("/reports");
                }}
                style={{ outline: "none" }}
                data-toggle="collapse"
                data-target="#sub-group-sales"
                aria-expanded="false"
                aria-controls="sub-group-sales"
              >
                Relatórios
              </button>
            </li>
          </div>
        </li>

        <li className="nav-item remove-style-link" key="6644855">
          <button
            className="btn-list-item btn-exit"
            onClick={e => {
              localStorageService.clearUser();
              closeNavResponsive();
              navigate("/login");
            }}
            style={{ outline: "none" }}
          >
            Sair
          </button>
        </li>
      </ul>
    </div>
  );
}
