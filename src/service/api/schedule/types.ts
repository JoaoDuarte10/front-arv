export type ScheduleInterface = {
  idschedules?: number;
  idclients: number | null;
  clientName: string | null;
  name?: string;
  phone?: string;
  description: string;
  expired?: boolean;
  time: string;
  initialTime?: string;
  endTime?: string;
  date: string;
  pacote: boolean;
  atendenceCount?: number;
  totalAtendenceCount: number;
  status: string;
  scheduleServices?: {
    name: string;
    idScheduleServices: number;
    idCatalog: number;
    price: number;
    duration: string;
  }[];
  idCatalogs?: number[];
  createdAt?: string;
  updatedAt?: string;
};
