import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type Props = {
  label: string;
  fnChange: any;
  value: any;
  type?: string;
  className?: string;
  helperText?: string;
};

export default function FullWidthTextField({
  label,
  fnChange,
  value,
  type,
  className,
  helperText
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
        onChange={fnChange}
        value={value}
        className={className}
        helperText={helperText}
      />
    </Box>
  );
}
