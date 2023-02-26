import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { randomId } from "../../utils/random";

export enum SelectorPoppover {
  view = "view"
}

type Action = {
  selector: SelectorPoppover;
  handleSubmit: () => void;
};

type Props = {
  actions: Action[];
};

export function BasicPopover({ actions }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const createSelect = (action: Action) => {
    return {
      view: (
        <button
          key={randomId()}
          className="btn btn-outline-secondary border-0"
          onClick={action.handleSubmit}
          style={{
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-eye-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          </svg>
          <Typography sx={{ marginLeft: "10px" }}>Visualizar</Typography>
        </button>
      )
    };
  };

  return (
    <div>
      <button
        className="btn btn-outline-secondary border-0"
        onClick={handleClick}
        style={{
          border: "none",
          borderRadius: "30px",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-three-dots-vertical"
          viewBox="0 0 16 16"
        >
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        {actions.map(select => {
          return createSelect(select)[select.selector];
        })}
      </Popover>
    </div>
  );
}
