import React from "react";
import { Alert } from "@mui/material";

export function AlertInfo(props: { title: string }) {
  const { title } = props;
  return (
    <Alert
      severity="info"
      color="info"
      className="mt-2 mb-3 border border-primary text-primary"
    >
      {title}
    </Alert>
  );
}
