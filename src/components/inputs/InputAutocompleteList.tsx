import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

type InputProps = {
  options: any[];
  label: string;
  value: any;
  onChange: any;
  style?: React.CSSProperties | undefined;
  className?: string;
  small?: boolean;
};

export default function ComboBoxList(props: InputProps) {
  const { options, label, value, onChange, style, className, small } = props;

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
    />
  );
}
