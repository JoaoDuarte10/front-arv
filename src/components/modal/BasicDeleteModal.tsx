import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  minWidth: "300px",
  fontFamily: "Montserrat",
  p: 2
};

export function BasicDeleteModal({ children, btnName, onChange }: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <button
        onClick={handleOpen}
        className="m-0 pl-1 pr-1 ml-1 mr-1 btn btn-outline-danger"
        style={{
          display: "flex",
          alignItems: "center",
          border: "none",
          backgroundColor: "transparent",
          outline: "none",
          padding: 0,
          margin: 0
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="red"
          className="bi bi-trash-fill"
          viewBox="0 0 16 16"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="text-right p-2 mb-2">
            <button
              type="button"
              className="close"
              onClick={e => handleClose()}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {children}
          <button
            className="btn btn-danger mt-4"
            onClick={(e: React.SyntheticEvent) => {
              onChange();
              handleClose();
            }}
          >
            {btnName}
          </button>
        </Box>
      </Modal>
    </Box>
  );
}
