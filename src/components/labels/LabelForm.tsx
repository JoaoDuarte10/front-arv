import React from "react";

export function LabelForm(props: {
  text: string;
  className?: string;
  children?: JSX.Element;
}) {
  return (
    <h6
      style={{
        fontSize: "1em",
        color: "#0275d8",
        fontWeight: "bold"
      }}
      className={props.className}
    >
      {props.text}: {props.children}
    </h6>
  );
}
