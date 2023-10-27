import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Option } from "./InputAutocompleteList";

export type AutocompleteFilterSelectedProps = {
    options: Option[]
    label: string;
    value: any;
    placeholder?: string;
    onChange: any;
    style?: React.CSSProperties | undefined;
    className?: string;
    small?: boolean;
    disabled?: boolean;
}

export default function AutocompleteFilterSelected({
    options,
    label,
    placeholder,
    value,
    onChange,
    style,
    className,
    small,
    disabled,
}: AutocompleteFilterSelectedProps) {
    return (
        <Autocomplete
          multiple
          id="tags-outlined"
          options={options}
          getOptionLabel={(option) => option.label}
          value={value}
          filterSelectedOptions
          onChange={onChange}
          className={className}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
            />
          )}
          size={small ? "small" : "medium"}
          disabled={disabled}
          style={style}
        />
    );
  }