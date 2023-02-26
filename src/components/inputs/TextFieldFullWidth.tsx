import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type Props = {
  label: string;
  fnChange?: any;
  customChange?: any;
  value: any;
  type?: string;
  className?: string;
  helperText?: string;
  disabled?: boolean;
  error?: boolean;
};

export default function FullWidthTextField({
  label,
  fnChange,
  customChange,
  value,
  type,
  className,
  helperText,
  disabled,
  error
}: Props) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <TextField
        variant="outlined"
        type={type}
        fullWidth
        label={label}
        id="fullWidth"
        sx={{
          borderRadius: "150px",
          border: "none",
          minWidth: "120px"
        }}
        onChange={customChange ? customChange : e => fnChange(e.target.value)}
        value={value}
        className={className}
        helperText={helperText}
        disabled={disabled}
        error={error}
      />
    </Box>
  );
}
