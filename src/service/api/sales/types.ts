import { OutgoingPaymentMethodEnums } from "../outgoing/types";

export type SalesInterface = {
  idsales: number;
  client: string;
  idclients: number;
  clientName: string;
  description: string;
  date: string;
  total: number;
  paymentStatus: string;
  paymentDate: string;
  paymentMethod: OutgoingPaymentMethodEnums;
  createdAt: string;
};

export type SalesReportsInterface = {
  basicInfos: {
    total: number;
    quantity: number;
    average: number;
    countClients: number;
    biggestValueSale: number;
    lowestValueSales: number;
  };
  biggestTotalWithDate: {
    total: number;
    countTotal: number;
    date: string;
  };
  lowestTotalWithDate: {
    total: number;
    countTotal: number;
    date: string;
  };
};
