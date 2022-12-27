import * as React from "react";
import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask";
import { Box } from "@material-ui/core";

type Props = {
  label: string;
  fnChange: any;
  value: any;
};

export default function InputMaskNumber({ label, fnChange, value }: Props) {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <InputMask
        type="number"
        mask="999999"
        maskChar={""}
        onChange={fnChange}
        required={true}
        value={value}
      >
        {() => <TextField fullWidth label={label} />}
      </InputMask>
    </Box>
  );
}
