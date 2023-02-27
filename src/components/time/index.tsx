import React from "react";
import { Box, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DesktopTimePicker } from "@mui/x-date-pickers";
import pt from "date-fns/locale/pt-BR";

type Props = {
  value: Date | null;
  setValue: any;
  label: string;
};

export const TimeInput = ({ value, setValue, label }: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pt}>
        <DesktopTimePicker
          label={label}
          value={value}
          onChange={(newValue: Date | null) => {
            setValue(newValue);
          }}
          renderInput={(params: any) => (
            <TextField {...params} error={false} fullWidth />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};
