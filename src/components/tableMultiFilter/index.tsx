import React, { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import { Typography, Checkbox, FormControlLabel } from "@mui/material";
import ComboBoxList from "../inputs/InputAutocompleteList";

import * as S from "./style";
import { randomId } from "../../utils/random";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export enum TypeMultiFilter {
  date = "date",
  text = "text",
  select = "select",
  period = "period",
  check = "check"
}

export type Period = {
  date1: {
    value: string;
    handleChangeValue: (param: any, values?: any) => void;
  };
  date2: {
    value: string;
    handleChangeValue: (param: any, values?: any) => void;
  };
};

export type MultFilter = {
  label: string;
  value: string | boolean;
  placeholder: string;
  type: keyof typeof TypeMultiFilter;
  period?: Period;
  options?: any[];
  handleChangeValue: (param: any, values?: any) => void;
  error?: boolean;
  helperText?: string;
  disabled: boolean;
};

type TableMultiFilterProps = {
  filters: MultFilter[];
  clearFilters: (e: React.BaseSyntheticEvent) => void;
  handleSubmit: () => Promise<boolean>;
  enableActionButtons?: boolean;
};

export function TableMultiFilter(props: TableMultiFilterProps) {
  const { filters, clearFilters, handleSubmit, enableActionButtons } = props;

  const [filterIsOpen, setFilterOpen] = useState(false);

  const filteredFilters = useMemo(() => filters.filter(filter => filter), [
    filters
  ]);
  const createInputFilter = (
    filter: MultFilter
  ): { [key in TypeMultiFilter]: JSX.Element } => {
    return {
      date: (
        <TextField
          variant="outlined"
          type="date"
          fullWidth
          label={""}
          value={filter.value}
          id="fullWidth"
          size="small"
          onChange={filter.handleChangeValue}
          error={filter.error}
          helperText={filter.helperText}
          disabled={filter.disabled}
        />
      ),
      text: (
        <TextField
          variant="outlined"
          type="text"
          fullWidth
          label={filter.label}
          value={filter.value}
          id="fullWidth"
          size="small"
          onChange={filter.handleChangeValue}
          disabled={filter.disabled}
        />
      ),
      select: (
        <ComboBoxList
          label={filter.placeholder}
          options={filter.options || []}
          onChange={filter.handleChangeValue}
          value={filter.value}
          small={true}
          disabled={filter.disabled}
        />
      ),
      period: (
        <div className="form-row">
          <div className="col">
            <TextField
              variant="outlined"
              type="date"
              fullWidth
              label={""}
              id="fullWidth"
              size="small"
              value={filter.period ? filter.period.date1.value : ""}
              style={{
                minWidth: "100px",
                padding: "5px 0"
              }}
              onChange={
                filter.period
                  ? filter.period.date1.handleChangeValue
                  : () => null
              }
              error={filter.error}
              helperText={filter.helperText}
              disabled={filter.disabled}
            />
          </div>
          <div className="col">
            <TextField
              variant="outlined"
              type="date"
              fullWidth
              label={""}
              id="fullWidth"
              size="small"
              value={filter.period ? filter.period.date2.value : ""}
              style={{
                minWidth: "100px",
                padding: "5px 0"
              }}
              onChange={
                filter.period
                  ? filter.period.date2.handleChangeValue
                  : () => null
              }
              error={filter.error}
              helperText={filter.helperText}
              disabled={filter.disabled}
            />
          </div>
        </div>
      ),
      check: (
        <FormControlLabel
          control={
            <Checkbox
              onChange={filter.handleChangeValue}
              color="primary"
              checked={filter.value as boolean}
            />
          }
          label=""
          sx={{
            paddingLeft: "5px"
          }}
          disabled={filter.disabled}
        />
      )
    };
  };

  return (
    <div>
      <button
        onClick={() => setFilterOpen(!filterIsOpen)}
        className="btn btn-primary font-weight-bold"
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "110px",
          borderRadius: "15px"
        }}
      >
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-filter"
            viewBox="0 0 16 16"
          >
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
          </svg>
        </>
        <>Filtros</>
      </button>

      {filterIsOpen && (
        <S.ContainerFilter>
          {filteredFilters.map((filter, index) => {
            return (
              <S.ContainerRowsFilter
                key={randomId()}
                check={filter.type === TypeMultiFilter.check}
              >
                <div
                  style={{
                    width:
                      filter.type === TypeMultiFilter.check ? "150px" : "80px",
                    margin: "5px 0"
                  }}
                >
                  <Typography>{filter.label}</Typography>
                </div>
                <S.ContainerColumnSelectorFilter
                  check={filter.type === TypeMultiFilter.check}
                >
                  {createInputFilter(filter)[filter.type]}
                </S.ContainerColumnSelectorFilter>
              </S.ContainerRowsFilter>
            );
          })}
          {enableActionButtons && (
            <div
              className="form-row"
              style={{
                margin: "5px 0",
                width: "60%"
              }}
            >
              <div className="col mt-1 mb-1">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary font-weight-bold col"
                >
                  Limpar
                </button>
              </div>
              <div className="col mt-1 mb-1">
                <button
                  onClick={async () => {
                    const result = await handleSubmit();
                    if (result) setFilterOpen(false);
                  }}
                  className="btn btn-primary font-weight-bold col"
                >
                  Filtrar
                </button>
              </div>
            </div>
          )}
        </S.ContainerFilter>
      )}
    </div>
  );
}
