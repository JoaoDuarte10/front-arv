import React from "react";

import { Alert } from "@mui/material";

export function AlertServerError() {
  return (
    <Alert
      severity="error"
      color="error"
      className="mt-2 mb-3 border border-danger text-danger"
    >
      Não foi possível processar a requisição.
    </Alert>
  );
}
