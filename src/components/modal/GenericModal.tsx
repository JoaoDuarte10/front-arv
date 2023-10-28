import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export enum ColorsBootstrap {
  success = 'success',
  primary = 'primary',
  secondary = 'secondary',
  error = 'error',
  warning = 'warning',
}

type InputProps = {
  children: JSX.Element | JSX.Element[];
  btnOpenName: string;
  color: ColorsBootstrap;
  styleModal?: any;
  styleBtn?: any;
  openModal: boolean;
  setOpenModal: any;
};

export function GenericModal(props: InputProps) {
  const {
    color,
    btnOpenName,
    children,
    styleModal,
    styleBtn,
    openModal,
    setOpenModal,
  } = props;

  return (
    <Box>
      <button
        onClick={e => setOpenModal(true)}
        className={`btn btn-${color} font-weight-bold`}
        style={styleBtn}
      >
        {btnOpenName}
      </button>
      <Modal
        open={openModal}
        onClose={e => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '5px',
            boxShadow: 24,
            minWidth: '300px',
            fontFamily: 'Montserrat',
            ...styleModal,
          }}
        >
          <div className="text-right p-2">
            <button
              type="button"
              className="close"
              onClick={e => setOpenModal(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="pt-2">{children}</div>
        </Box>
      </Modal>
    </Box>
  );
}
