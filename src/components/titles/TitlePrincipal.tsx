import React from "react";

export function TitlePrincipal(props: { title: string }) {
  return <h3 className="title-page border-bottom pb-3 mb-4">{props.title}</h3>;
}
