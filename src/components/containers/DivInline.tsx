import React from "react";

export function DivInline(props: {
  style?: any;
  className?: string;
  children: any;
}) {
  const { children, style, className } = props;
  return (
    <div className={`form-row ${className}`} style={style}>
      {children}
    </div>
  );
}
