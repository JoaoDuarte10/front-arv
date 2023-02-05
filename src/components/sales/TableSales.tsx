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
} from "@mui/icons-material";
import { SalesService } from "../../service/api/sales/sales";
import { SalesInterface } from "../../service/api/sales/types";
import { randomId } from "../../utils/random";
import { format, formatDistance } from "date-fns";
import { AlertError } from "../alerts/AlertError";
import { AlertInfo } from "../alerts/AlertInfo";
import { AlertSuccess } from "../alerts/AlertSuccess";
import { TIMEOUT } from "../../utils/constants";
import { BasicDeleteModal } from "../modal/BasicDeleteModal";
import { CircularIndeterminate } from "../loaders/CircularLoader";
import TablePagination from "@mui/material/TablePagination";

import ptBR from "date-fns/locale/pt-BR";
import { BasicPopover, SelectorPoppover } from "../popover/index";
import { useNavigate } from "react-router-dom";

type InputProps = {
  sales: SalesInterface[];
  salesService: SalesService;
};

export function TableSales(props: InputProps) {
  const { sales, salesService } = props;

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
          {sales
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(sale => (
              <Row
                keyId={sale.idsales + randomId()}
                row={createData(sale)}
                salesService={salesService}
              />
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        aria-label="Deee"
        labelRowsPerPage="Linhas por página"
      />
    </TableContainer>
  );
}

function createData(sale: SalesInterface) {
  return {
    idsales: sale.idsales,
    client: sale.client,
    date: sale.date,
    description: sale.description,
    idclients: sale.idclients,
    info: [
      {
        total: Number(sale.total),
        paymentStatus: sale.paymentStatus,
        paymentDate: sale.paymentDate,
        paymentMethod: sale.paymentMethod,
        createdAt: sale.createdAt
      }
    ]
  };
}

function Row(props: {
  row: ReturnType<typeof createData>;
  salesService: SalesService;
  keyId: string;
}) {
  const navigate = useNavigate();

  const { row, salesService, keyId } = props;
  const [open, setOpen] = useState<boolean>(false);

  const [alertInfo, setAlert] = useState<JSX.Element | null>(null);
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

  const copySale = async (
    e: React.BaseSyntheticEvent,
    sale: ReturnType<typeof createData>
  ) => {
    e.preventDefault();
    const saleIsPaid = sale.info[0].paymentStatus === "PAID";
    const saleInfo = `Olá ${sale.client}, tudo bem?

Registrei uma nova venda para você referente à ${
      sale.description
    }, do dia ${new Date(row.date).toLocaleDateString("pt-BR", {
      timeZone: "UTC"
    })}.

E gostaria de informar que o seu pagamento no valor de ${sale.info[0].total.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )} ${
      saleIsPaid
        ? `foi recebido ${formatDistance(
            new Date(sale.info[0].paymentDate),
            new Date(),
            { locale: ptBR, addSuffix: true }
          )} :)`
        : "ainda está pendente"
    }

${
  saleIsPaid && sale.info[0].paymentMethod
    ? `Forma de pagamento: ${sale.info[0].paymentMethod}`
    : ""
}

Código da venda: ${sale.idsales}

Agradecemos a confiança!!!`;

    unsecuredCopyToClipboard(saleInfo);

    alert("Texto copiado!");
  };

  const unsecuredCopyToClipboard = (text: any) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
    document.body.removeChild(textArea);
  };

  if (alertInfo) {
    setTimeout(() => setAlert(null), TIMEOUT.THREE_SECCONDS);
  }

  return (
    <React.Fragment>
      {loader}

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} id={keyId}>
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
        <TableCell
          component="th"
          scope="row"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <>
            {row.client}
            <BasicPopover
              actions={[
                {
                  selector: SelectorPoppover.view,
                  handleSubmit: () => {
                    navigate(`/info-client/${row.idclients}`);
                  }
                }
              ]}
            />
          </>
        </TableCell>
        <TableCell align="center">
          {new Date(row.date).toLocaleDateString("pt-BR", {
            timeZone: "UTC"
          })}
        </TableCell>
        <TableCell align="center">
          {row.info[0].paymentStatus === "PAID" ? (
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
              <>
                <div>
                  <small className="font-weight-bold h6 text-muted">
                    Código da venda:
                  </small>{" "}
                  {row.idsales}
                </div>
                <div>
                  <small className="font-weight-bold h6 text-muted">
                    Criada em:
                  </small>{" "}
                  {format(
                    new Date(row.info[0].createdAt.replace("Z", "")),
                    "dd/MM/yyyy 'às' HH:mm'h'"
                  )}
                </div>
              </>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  margin: "10px 0"
                }}
              >
                {row.info[0].paymentStatus === "PAID" ? null : (
                  <button
                    className="btn btn-success"
                    style={{
                      borderRadius: "15px",
                      fontSize: "13px"
                    }}
                    onClick={(e: React.SyntheticEvent) =>
                      registerPayment(row.idsales)
                    }
                  >
                    Registrar Pagamento
                  </button>
                )}
                <button
                  className="btn btn-outline-primary"
                  onClick={e => copySale(e, row)}
                  style={{
                    borderRadius: "15px",
                    fontSize: "13px",
                    margin: "0 10px"
                  }}
                >
                  Copiar texto
                </button>
                <BasicDeleteModal
                  btnName="Excluir"
                  onChange={(e: React.SyntheticEvent) =>
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

              {alertInfo}

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
                        Forma de Pagamento
                      </strong>
                    </TableCell>
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
                        {row.info[0].paymentStatus === "PAID"
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
                        {info.paymentMethod || "Não registrado"}
                      </TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {info.paymentStatus === "PAID" ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell component="th" scope="row" align="right">
                        {format(
                          new Date(info.paymentDate.replace("Z", "")),
                          "dd/MM/yyyy"
                        )}
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
