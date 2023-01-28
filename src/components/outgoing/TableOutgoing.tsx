import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { randomId } from "../../utils/random";
import { format } from "date-fns";
import { OutgoingInterface } from "../../service/outgoing";
import TablePagination from "@mui/material/TablePagination";

type InputProps = {
  outgoings: OutgoingInterface[];
};

export function TableOutgoing(props: InputProps) {
  const { outgoings } = props;

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <TableContainer component={Paper} className="mt-4 mb-4">
      <Table aria-label="collapsible table">
        <TableHead
          style={{
            backgroundColor: "#0275d8"
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell
              style={{
                color: "white"
              }}
            >
              Descrição
            </TableCell>
            <TableCell
              align="center"
              style={{
                color: "white"
              }}
            >
              Data
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {outgoings
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(outgoing => (
              <Row
                key={outgoing.idoutgoing + randomId()}
                row={createData(outgoing)}
              />
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={outgoings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página"
      />
    </TableContainer>
  );
}

function createData(outgoing: OutgoingInterface) {
  return {
    idoutgoing: outgoing.idoutgoing,
    description: outgoing.description,
    date: outgoing.date,
    info: [
      {
        total: Number(outgoing.total),
        paymentMethod: outgoing.paymentMethod,
        installment: outgoing.installment,
        createdAt: outgoing.createdAt
      }
    ]
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ outline: "none" }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.description}
        </TableCell>

        <TableCell align="center">
          {new Date(row.date).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div>
                <small className="font-weight-bold h6 text-muted">
                  Criada em:
                </small>{" "}
                <small>
                  {format(
                    new Date(
                      row.info[0].createdAt
                        ? row.info[0].createdAt.replace("Z", "")
                        : ""
                    ),
                    "dd/MM/yyyy 'às' HH:mm'h'"
                  )}
                </small>
              </div>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{ fontFamily: "Montserrat" }}>
                    <TableCell align="right" variant="body">
                      <strong
                        style={{
                          color: "#4083be"
                        }}
                      >
                        Forma de Pagamento
                      </strong>
                    </TableCell>
                    <TableCell align="right" variant="body">
                      <strong
                        style={{
                          color: "#4083be"
                        }}
                      >
                        Prazo de Pagamento
                      </strong>
                    </TableCell>
                    <TableCell align="right" variant="body">
                      <strong
                        style={{
                          color: "#4083be"
                        }}
                      >
                        Total
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.info.map(info => (
                    <TableRow key={randomId()}>
                      <TableCell component="th" scope="row" align="right">
                        {info.paymentMethod}
                      </TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {info.installment}
                      </TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {info.total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
