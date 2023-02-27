import React from "react";
import { Box, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import pt from "date-fns/locale/pt-BR";

type Props = {
  value: Date | null;
  setValue: any;
  label: string;
  size?: "small" | "medium";
  disabled?: boolean;
};

export const DateInput = ({
  value,
  setValue,
  label,
  size = "medium",
  disabled
}: Props) => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        padding: "5px 0"
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pt}>
        <DesktopDatePicker
          label={label}
          value={value}
          onChange={(newValue: Date | null) => {
            setValue(newValue);
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              error={false}
              fullWidth
              size={size}
              disabled={disabled}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};
