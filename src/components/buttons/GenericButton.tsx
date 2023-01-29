import React from "react";
import { ColorsBootstrap } from "../modal/GenericModal";

export enum ColorsMaterialUi {
  success = "success",
  info = "info",
  error = "error",
  primary = "primary",
  secondary = "secondary",
  inherit = "inherit"
}

export enum Variant {
  contained = "contained",
  outline = "outlined"
}

type InputProps = {
  text: string;
  color: ColorsBootstrap;
  variant?: Variant;
  onClick: any;
  style?: any;
  col?: boolean;
};

export function GenericButton(props: InputProps) {
  const { text, color, variant, onClick, style, col: col = true } = props;

  return (
    <button
      className={`btn btn${variant ? "-" + variant : ""}${"-" +
        color} font-weight-bold ${col ? "col" : null}`}
      style={{ ...style }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
