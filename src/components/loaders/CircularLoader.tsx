import "../../css/main.css";
import React from "react";

export function CircularIndeterminate() {
  return (
    <div
      style={{
        display: "flex",
        position: "fixed",
        width: "100",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 5,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className="loader"></div>
    </div>
  );
}
