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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CheckCircle,
  Cancel
} from "@material-ui/icons";
import { SalesInterface, SalesService } from "../../service/sales";
import { randomId } from "../../utils/random";
import { format } from "date-fns";
import { AlertError } from "../alerts/AlertError";
import { AlertInfo } from "../alerts/AlertInfo";
import { AlertSuccess } from "../alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { BasicDeleteModal } from "../modal/BasicDeleteModal";
import { CircularIndeterminate } from "../loaders/CircularLoader";

type InputProps = {
  sales: SalesInterface[];
  salesService: SalesService;
};

export function TableSales(props: InputProps) {
  const { sales, salesService } = props;

  return (
    <TableContainer component={Paper} className="mt-4 mb-4">
      <Table aria-label="collapsible table">
        <TableHead
          style={{
            backgroundColor: "#4083be"
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell
              style={{
                color: "white"
              }}
            >
              Cliente
            </TableCell>
            <TableCell
              align="center"
              style={{
                color: "white"
              }}
            >
              Data
            </TableCell>
            <TableCell
              align="center"
              style={{
                color: "white"
              }}
            >
              Pago
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map(sale => (
            <Row
              key={sale.idsales}
              row={createData(sale)}
              salesService={salesService}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function createData(sale: SalesInterface) {
  return {
    idsales: sale.idsales,
    client: sale.client,
    date: sale.date,
    description: sale.description,
    info: [
      {
        total: Number(sale.total),
        payment_status: sale.payment_status,
        payment_date: sale.payment_date
      }
    ]
  };
}

function Row(props: {
  row: ReturnType<typeof createData>;
  salesService: SalesService;
}) {
  const { row, salesService } = props;
  const [open, setOpen] = useState<boolean>(false);

  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const registerPayment = async (idsales: number) => {
    setLoader(<CircularIndeterminate />);
    const { success, error, notFound } = await salesService.registerPayment(
      idsales
    );
    setLoader(null);

    if (success) {
      setAlert(
        <AlertSuccess title="Pagamento registrado! Atualize a pesquisa" />
      );
    }
    if (notFound) {
      setAlert(<AlertInfo title="Venda não encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  const deleteSale = async (idsales: number) => {
    setLoader(<CircularIndeterminate />);
    const { success, error, notFound } = await salesService.delete(idsales);
    setLoader(null);

    if (success) {
      setAlert(
        <AlertSuccess title="Pagamento registrado! Atualize a pesquisa" />
      );
    }
    if (notFound) {
      setAlert(<AlertInfo title="Venda não encontrada." />);
    }
    if (error) {
      setAlert(
        <AlertError title="Não foi possível processar sua requisição." />
      );
    }
  };

  if (alert) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
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
          {row.client}
        </TableCell>
        <TableCell align="center">
          {new Date(row.date).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          })}
        </TableCell>
        <TableCell align="center">
          {row.info[0].payment_status === "PAID" ? (
            <CheckCircle htmlColor="#5cb85c" />
          ) : (
            <Cancel htmlColor="#f0ad4e" />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  margin: "10px 0"
                }}
              >
                {row.info[0].payment_status === "PAID" ? null : (
                  <button
                    className="btn btn-success"
                    style={{
                      borderRadius: "15px"
                    }}
                    onClick={(e: React.SyntheticEvent) =>
                      registerPayment(row.idsales)
                    }
                  >
                    Registrar Pagamento
                  </button>
                )}
                <BasicDeleteModal
                  btnName="Excluir"
                  onDeleteClient={async (e: React.SyntheticEvent) =>
                    deleteSale(row.idsales)
                  }
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ color: "red" }}
                  >
                    Excluir Venda
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Tem certeza que deseja excluir essa venda?
                  </Typography>
                </BasicDeleteModal>
              </div>

              {alert}

              <Typography variant="inherit" gutterBottom component="div">
                <strong>Descrição</strong>
              </Typography>
              <Typography variant="body2" gutterBottom component="div">
                {row.description}
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{ fontFamily: "Montserrat" }}>
                    <TableCell align="right" variant="body">
                      <strong
                        style={{
                          color: "#4083be"
                        }}
                      >
                        Pagamento recebido
                      </strong>
                    </TableCell>
                    <TableCell align="right" variant="body">
                      <strong
                        style={{
                          color: "#4083be"
                        }}
                      >
                        {row.info[0].payment_status === "PAID"
                          ? "Data do pagamento"
                          : "Previsão de pagamento"}
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
                        {info.payment_status === "PAID" ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {format(new Date(info.payment_date), "dd/MM/yyyy")}
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