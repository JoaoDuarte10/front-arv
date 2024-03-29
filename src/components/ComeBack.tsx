import React from 'react';

import { useNavigate } from 'react-router-dom';

export function ComeBack() {
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-primary d-flex flex-row align-items-center font-weight-bold"
      onClick={() => navigate(-1)}
      style={{ borderRadius: '15px' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-arrow-left-circle mr-2 font-weight-bold"
        viewBox="0 0 16 16"
      >
        <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
      </svg>
      Voltar
    </button>
  );
}
