import React, { useEffect, useState } from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { ReduceStore } from "../app/store";
import { clearClient, clientAdded } from "../reducers/clients-slice";
import ComboBoxList from "./inputs/InputAutocompleteList";
import TextFieldMultiline from "./inputs/TextFieldMultiline";
import { CircularIndeterminate } from "./loaders/CircularLoader";
import { ClientService } from "../service/api/client/client-service";
import { ScheduleInterface } from "../service/api/schedule/types";
import { format, getHours, getMinutes } from "date-fns";
import { InputText } from "./inputs/InputText";
import { DivInline } from "./containers/DivInline";
import { ContainerCardWhite } from "./containers/ContainerCardWhite";
import { GenericButton } from "./buttons/GenericButton";
import { ColorsBootstrap } from "./modal/GenericModal";
import { ClientsInterface } from "../service/api/client/types";
import { DateInput } from "./date/index";
import { TimeInput } from "./time/index";

type InputProps = {
  clientService: ClientService;
  alert: JSX.Element | null;
  onChange: any;
  edit: boolean;
  schedule?: ScheduleInterface;
};

export function FormSchedule(props: InputProps) {
  const { clientService, alert, onChange, edit, schedule } = props;

  const clientsCache = useSelector((state: ReduceStore) => state.client);

  const [clients, setClients] = useState<ClientsInterface[]>([]);

  const [idschedules, setIdSchedules] = useState<number | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [time, setTime] = useState<Date | string | null>(null);
  const [date, setDate] = useState<Date | string | null>(null);
  const [pacote, setPacote] = useState<boolean>(false);
  const [atendenceCount, setAtendenceCount] = useState<number>(0);
  const [totalAtendenceCount, setTotalAtendenceCount] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [clientSelected, setClientSelected] = useState<{
    label: string;
    idclients: number | null;
  }>({ label: "", idclients: null });

  const [loader, setLoader] = useState<JSX.Element | null>(null);

  const atendenceOptions = ["1", "2", "3", "4", "5"];

  const dispatch = useDispatch();

  const getAllClients = async () => {
    setLoader(<CircularIndeterminate />);
    const { data } = await clientService.fetchAllClients();
    setLoader(null);

    if (data) {
      dispatch(clearClient());
      setClients(data);
      dispatch(clientAdded(data));
    }
  };

  useEffect(() => {
    if (!clientsCache.length) {
      getAllClients();
    } else {
      setClients(clientsCache);
    }

    if (edit && schedule) {
      setIdSchedules(schedule.idschedules || 0);
      setClientName(schedule.clientName);
      setDescription(schedule.description);
      setTime(schedule.time);
      setDate(format(new Date(schedule.date.replace("Z", "")), "yyyy-MM-dd"));
      setPacote(schedule.pacote);
      setAtendenceCount(schedule.atendenceCount || 0);
      setTotalAtendenceCount(schedule.totalAtendenceCount);
      setStatus(schedule.status);
      setClientSelected({
        label: schedule.name || schedule.clientName || "",
        idclients: schedule.idclients || null
      });
    }
  }, []);

  const clearFields = () => {
    setClientName("");
    setDescription("");
    setTime(null);
    setDate(null);
    setPacote(false);
    setAtendenceCount(0);
    setTotalAtendenceCount(0);
    setStatus("");
    setClientSelected({ label: "", idclients: null });
  };

  return (
    <div>
      {loader}

      <ContainerCardWhite>
        <div className="pb-2">
          <small className="font-weight-bold">
            Os campos que possuem " * " são obrigatórios!
          </small>
        </div>

        {edit ? (
          <InputText
            type="text"
            id="procedure"
            value={clientSelected.label}
            onChange={null}
            label="Cliente"
            disabled={true}
          />
        ) : (
          <ComboBoxList
            options={clients.map(client => {
              return {
                label: client.name,
                idclients: client.idclients
              };
            })}
            label={"Selecione o cliente*"}
            value={clientSelected}
            onChange={(
              _e: React.BaseSyntheticEvent,
              item: { label: string; idclients: number } | string
            ) => {
              if (typeof item === "string") {
                setClientName(item);
                setClientSelected({ label: item, idclients: null });
              } else {
                setClientSelected({
                  label: item.label,
                  idclients: item.idclients
                });
                setClientName(null);
              }
            }}
          />
        )}

        <TextFieldMultiline
          label="Descrição*"
          value={description}
          fnChange={(e: React.BaseSyntheticEvent) => {
            setDescription(e.target.value);
          }}
          className="mt-1"
          rows={2}
        />
        <DivInline>
          <div className="col">
            <DateInput value={date as Date} setValue={setDate} label="Data" />
          </div>
          <div className="col">
            <TimeInput value={time as Date} setValue={setTime} label="Horário" />
          </div>
        </DivInline>

        <div className="payment_form mb-3">
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e: React.BaseSyntheticEvent) => {
                    setPacote(!pacote);
                  }}
                  color="primary"
                  checked={pacote}
                />
              }
              label="Pacote?"
            />
          </FormGroup>

          {pacote ? (
            <DivInline>
              <ComboBoxList
                options={atendenceOptions}
                label="Total de atendimentos"
                value={totalAtendenceCount}
                onChange={(e: React.BaseSyntheticEvent, item: any) => {
                  if (atendenceOptions.includes(item)) {
                    setTotalAtendenceCount(item);
                  }
                }}
                className="col"
              />
              {edit && (
                <ComboBoxList
                  options={atendenceOptions}
                  label="Atendimento atual"
                  value={atendenceCount}
                  onChange={(e: React.BaseSyntheticEvent, item: any) => {
                    if (atendenceOptions.includes(item)) {
                      setAtendenceCount(item);
                    }
                  }}
                  className="col"
                />
              )}
            </DivInline>
          ) : null}
        </div>

        <DivInline>
          {!edit && (
            <div className="col">
              <GenericButton
                text="Limpar"
                color={ColorsBootstrap.secondary}
                onClick={(e: React.SyntheticEvent) => {
                  clearFields();
                }}
              />
            </div>
          )}
          <div className="col">
            <GenericButton
              text={edit ? "Salvar" : "Criar"}
              color={ColorsBootstrap.primary}
              onClick={async (e: React.SyntheticEvent) => {
                const result = await onChange({
                  idschedules,
                  idclients: clientSelected.idclients,
                  clientName,
                  description,
                  time: `${getHours(time as Date)}:${getMinutes(time as Date)}`,
                  date,
                  pacote,
                  atendenceCount: Number(atendenceCount),
                  totalAtendenceCount: Number(totalAtendenceCount),
                  status
                });
                if (result) {
                  clearFields();
                }
              }}
            />
          </div>
        </DivInline>

        <div className="mt-3">{alert}</div>
      </ContainerCardWhite>
    </div>
  );
}
