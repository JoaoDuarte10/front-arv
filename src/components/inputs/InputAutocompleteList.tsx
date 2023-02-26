import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export type Option<T = any> = {
  label: string;
  value: T;
};

type InputProps = {
  options: any[] | Option[];
  label: string;
  value: any;
  onChange: any;
  style?: React.CSSProperties | undefined;
  className?: string;
  small?: boolean;
  disabled?: boolean;
};

export default function ComboBoxList(props: InputProps) {
  const {
    options,
    label,
    value,
    onChange,
    style,
    className,
    small,
    disabled = false
  } = props;

  return (
    <Autocomplete
      disablePortal
      options={options}
      renderInput={params => (
        <TextField variant="outlined" {...params} label={label} />
      )}
      value={value}
      onInputChange={onChange}
      onChange={onChange}
      autoHighlight
      style={style}
      className={className}
      size={small ? "small" : "medium"}
      disabled={disabled}
    />
  );
}
