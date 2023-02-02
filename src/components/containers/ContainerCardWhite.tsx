import React from "react";

export function ContainerCardWhite({ children, key, style }: any) {
  return (
    <div
      key={key}
      style={{
        backgroundColor: "white",
        padding: "15px",
        ...style
      }}
    >
      {children}
    </div>
  );
}
