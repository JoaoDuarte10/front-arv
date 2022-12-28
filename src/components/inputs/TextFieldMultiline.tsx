import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

type Props = {
  label: string;
  fnChange: any;
  value: any;
  type?: string;
  rows: number;
};

export default function TextFieldMultiline({
  label,
  fnChange,
  value,
  type,
  rows
}: Props) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <TextField
        fullWidth
        label={label}
        id="fullWidth"
        sx={{
          borderRadius: "150px",
          border: "none"
        }}
        multiline
        rows={rows}
        onChange={fnChange}
        value={value}
        type={type}
      />
    </Box>
  );
}
