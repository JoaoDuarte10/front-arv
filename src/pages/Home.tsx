import "../css/main.css";

import React from "react";
import { useSelector } from "react-redux";

import { ReduceStore } from "../app/store";

import { Breadcumb } from "../components/Breadcumb";
import { TitlePrincipal } from "../components/titles/TitlePrincipal";
import { ContainerMain } from "../components/divs/ContainerMain";

export function Home() {
  const username = useSelector((state: ReduceStore) => state.authenticated)
    .username;

  return (
    <ContainerMain>
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
      <p className="mt-5 mb-3 text-muted text-center">
        ARV - Controll &copy; 2022
      </p>
    </ContainerMain>
  );
}
