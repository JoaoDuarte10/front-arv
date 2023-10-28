import React from 'react';

import { Box, Button, Grid, Modal, Stack, Typography } from '@mui/material';

type Props = {
  open: boolean;
  handleClose: any;
  onChange: any;
};

export const DeleteResourceModal = (props: Props) => {
  const { open, handleClose, onChange } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Atenção
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Deseja mesmo excluir?
        </Typography>

        <Grid container justifyContent="flex-end" marginTop={2}>
          <Stack direction="row">
            <Button onClick={handleClose}>Cancelar</Button>
            <Button color="error" onClick={onChange}>
              Excluir
            </Button>
          </Stack>
        </Grid>
      </Box>
    </Modal>
  );
};
