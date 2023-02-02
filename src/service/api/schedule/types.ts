export type ScheduleInterface = {
  idschedules?: number;
  idclients: number | null;
  clientName: string | null;
  name?: string;
  phone?: string;
  description: string;
  expired?: boolean;
  time: string;
  date: string;
  pacote: boolean;
  atendenceCount?: number;
  totalAtendenceCount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};
