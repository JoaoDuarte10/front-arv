import React, { useEffect, useState } from 'react';
import '../css/main.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReduceStore } from '../app/store';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { LocalStorageService } from '../service/localStorage/local-storage';
import { RulesService } from '../service/api/rules/rules';
import { randomId } from '../utils/random';

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
  const [openOutgoing, setOpenOutgoing] = useState<boolean>(false);
  const [openCatalog, setOpenCatalog] = useState<boolean>(false);
  const [openManagement, setOpenManagement] = useState<boolean>(false);

  const closeItens = () => {
    setOpenSales(false);
    setOpenClients(false);
    setOpenSchedules(false);
    setOpenOutgoing(false);
    setOpenCatalog(false);
    setOpenManagement(false);
    closeNavResponsive();
  };

  const closeNavResponsive = () => {
    const navGroupElement = document.getElementById('navGroup');

    if (navGroupElement) {
      if (navGroupElement.className === 'nav-group') {
        navGroupElement.className += '-responsive';
      } else {
        navGroupElement.className = 'nav-group';
      }
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
              closeItens();
              navigate('/home');
            }}
            style={{ outline: 'none' }}
          >
            Home
          </button>
        </li>
        {rules.includes(ruleService.ruleWithPage('schedule')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenSchedules(!openSchedules)}
            >
              Agenda
              {openSchedules ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openSchedules} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" data-dismiss="modal" key={randomId()}>
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/create-schedule');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Nova Agenda
                  </button>
                </li>
                <li className="sub-item" data-dismiss="modal" key={randomId()}>
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/schedules');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Suas Agendas
                  </button>
                </li>
                <li className="sub-item" data-dismiss="modal" key={randomId()}>
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/schedule-history');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Histórico
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage('clients')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenClients(!openClients)}
            >
              Clientes
              {openClients ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openClients} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" key="33745">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/client/create');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Novo Cliente
                  </button>
                </li>
                <li className="sub-item" key="3345">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/clients');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Seus Clientes
                  </button>
                </li>
                <li className="sub-item" key="434">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/segments');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Segmentos
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage('sales')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenSales(!openSales)}
            >
              Vendas
              {openSales ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openSales} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" key="6948">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/create-sale');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Nova Venda
                  </button>
                </li>
                <li className="sub-item" key="3445">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/sales');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Suas Vendas
                  </button>
                </li>
                <li className="sub-item" key="346346">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/sales-reports');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Relatórios
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage('outgoing')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenOutgoing(!openOutgoing)}
            >
              Despesas
              {openOutgoing ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openOutgoing} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" key="6948">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/create-outgoing');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Nova despesa
                  </button>
                </li>
                <li className="sub-item" key="3445">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/outgoings');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Suas despesas
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage('catalogs')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenCatalog(!openCatalog)}
            >
              Serviços
              {openCatalog ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openCatalog} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" key="69482">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/catalogs/create');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Novo Serviço
                  </button>
                </li>
                <li className="sub-item" key="34454">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/catalogs');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Seus Serviços
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        {rules.includes(ruleService.ruleWithPage('management')) && (
          <li className="nav-item remove-style-link" key={randomId()}>
            <button
              className="btn-list-item"
              style={{ outline: 'none' }}
              onClick={e => setOpenManagement(!openManagement)}
            >
              Gerenciamento
              {openManagement ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            <Collapse in={openManagement} timeout="auto" unmountOnExit>
              <ul
                style={{ listStyle: 'none', listStyleType: 'none', padding: 0 }}
              >
                <li className="sub-item" key="69482">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/catalogs/create');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Tipos de usuários
                  </button>
                </li>
                <li className="sub-item" key="34454">
                  <button
                    className="btn-list-sub-item"
                    onClick={e => {
                      closeItens();
                      navigate('/rules');
                    }}
                    style={{ outline: 'none' }}
                  >
                    Permissões
                  </button>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
        <li className="nav-item remove-style-link" key="6644855">
          <a
            href={process.env.REACT_APP_BASE_URL + '/login'}
            rel="noopener noreferrer"
            onClick={e => {
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
