import "../css/main.css";

import React from "react";
import { useSelector } from "react-redux";

import { ReduceStore } from "../app/store";

import { Breadcumb } from "../components/Breadcumb";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";

export function Home() {
  const username = useSelector((state: ReduceStore) => state.authenticated)
    .username;

  return (
    <div className="container-main">
      <Breadcumb page={[]} />

      <TitlePrincipal
        title={`Olá, ${username ? username : "Seja Bem Vindo"}!`}
      />
      <p>
        Este é o <strong>ARV - Controll &copy;</strong>, um Sistema de
        Gerenciamento para sua empresa.
      </p>
      <p>
        O sistema é focado na simplicidade e acessibilidade, podendo ser
        utilizado pelo computador ou pelo celular, sem perda de desempenho ou
        produtividade.
      </p>
      {/* <div className="container mt-5 mb-5">
        <h5 className="title-page">Ajuda</h5>
        <p>
          Caso precise de ajuda ou queira tirar dúvidas sobre o sistema, entre
          em contato com o desenvolvedor.
        </p>
        <button
          type="button"
          // onClick={(e) => WhatsAppService.redirectToWhatsapp(e, '35999554534')}
          className="btn btn-success col"
        >
          Entrar em contato
        </button>
      </div> */}
      <p className="mt-5 mb-3 text-muted text-center">
        ARV - Controll &copy; 2022
      </p>
    </div>
  );
}
