export enum OutgoingInstallmentEnums {
  A_VISTA = 'À vista',
  PARCELADO = 'Parcelado',
}

export enum OutgoingPaymentMethodEnums {
  CARTAO_DE_CREDITO = 'Cartão de crédito',
  DINHEIRO = 'Dinheiro',
  PIX = 'PIX',
  BOLETO = 'Boleto',
}

export type OutgoingInterface = {
  idoutgoing?: number;
  description: string;
  date: Date | string | null;
  total: number;
  paymentMethod: OutgoingPaymentMethodEnums;
  installment: boolean | OutgoingInstallmentEnums;
  createdAt?: string;
  updatedAt?: string;
};
