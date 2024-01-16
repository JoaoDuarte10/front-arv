import * as React from 'react';
import TextField from '@mui/material/TextField';
import InputMask from 'react-input-mask';
import { Box } from '@mui/material';

type Props = {
  label: string;
  fnChange: any;
  value: any;
  disabled?: boolean;
};

export default function InputMaskCNPJ({
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
        type="number"
        mask="99.999.999/9999-99"
        maskChar={''}
        onChange={fnChange}
        required={true}
        value={value}
        disabled={disabled}
      >
        {() => <TextField variant="outlined" fullWidth label={label} />}
      </InputMask>
    </Box>
  );
}
