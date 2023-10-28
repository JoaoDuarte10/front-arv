import React from 'react';

import { Snackbar, Stack } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function AlertInfo(props: { title: string }) {
  const { title } = props;

  const [open, setOpen] = React.useState(true);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          severity="info"
          color="info"
          className="mt-2 mb-3 border border-primary"
          onClose={handleClose}
          sx={{ width: '100%' }}
        >
          {title}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
