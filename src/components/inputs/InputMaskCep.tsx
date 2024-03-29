import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';
import Box from '@mui/material/Box';

type Props = {
  label: string;
  fnChange: any;
  value: any;
  disabled: boolean;
};

export default function InputMaskCep({
  label,
  fnChange,
  value,
  disabled,
}: Props) {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        padding: '5px 0',
      }}
    >
      <InputMask
        mask="99999-999"
        onChange={fnChange}
        value={value}
        disabled={disabled}
      >
        {() => <TextField variant="outlined" fullWidth label={label} />}
      </InputMask>
    </Box>
  );
}
