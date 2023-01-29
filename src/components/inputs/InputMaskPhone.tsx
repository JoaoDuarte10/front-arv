import * as React from "react";
import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask";
import Box from "@mui/material/Box";

type Props = {
  label: string;
  fnChange: any;
  value: any;
};

export default function InputMaskPhone({ label, fnChange, value }: Props) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <InputMask mask="(99) 9 9999-9999" onChange={fnChange} value={value}>
        {() => <TextField variant="outlined" fullWidth label={label} />}
      </InputMask>
    </Box>
  );
}
