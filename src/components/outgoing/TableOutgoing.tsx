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
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { randomId } from "../../utils/random";
import { format } from "date-fns";
import { OutgoingService } from "../../service/api/outgoing/outgoing";
import { OutgoingInterface } from "../../service/api/outgoing/types";
import TablePagination from "@mui/material/TablePagination";
import { CircularIndeterminate } from "../loaders/CircularLoader";
import { AlertSuccess } from "../alerts/AlertSuccess";
import { AlertInfo } from "../alerts/AlertInfo";
import { AlertError } from "../alerts/AlertError";
import { BasicDeleteModal } from "../modal/BasicDeleteModal";
import Typography from "@mui/material/Typography";
import { TIMEOUT } from "../../utils/constants";

type InputProps = {
  outgoings: OutgoingInterface[];
  outgoingService: OutgoingService;
};

export function TableOutgoing(props: InputProps) {
  const { outgoingService, outgoings } = props;

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
                outgoingService={outgoingService}
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

function Row(props: {
  row: ReturnType<typeof createData>;
  outgoingService: OutgoingService;
}) {
  const { row, outgoingService } = props;
  const [open, setOpen] = useState<boolean>(false);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const onDelete = async (idoutgoing: number): Promise<void> => {
    setLoader(<CircularIndeterminate />);
    const { success, error, notFound } = await outgoingService.delete(
      idoutgoing
    );
    setLoader(null);

    if (success) {
      setAlert(
        <AlertSuccess title="Despesa excluída com sucesso. Atualize a pesquisa." />
      );
    }
    if (notFound) {
      setAlert(<AlertInfo title="Despesa não encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.FIVE_SECCONDS);
  }

  return (
    <React.Fragment>
      {loader}
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  margin: "10px 0"
                }}
              >
                <BasicDeleteModal
                  btnName="Excluir"
                  onChange={(e: React.SyntheticEvent) =>
                    onDelete(row.idoutgoing as number)
                  }
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ color: "red" }}
                  >
                    Excluir Despesa
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Tem certeza que deseja excluir essa despesa?
                  </Typography>
                </BasicDeleteModal>
              </div>

              {alert}

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
