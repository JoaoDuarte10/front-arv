import React from "react";

export function LabelSmall(props: { text: string | number }) {
  return <small className="text-muted h6">{props.text}</small>;
}
