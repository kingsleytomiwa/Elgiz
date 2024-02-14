import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  debounce,
} from "@mui/material";
import { ExpandMore, Close } from "@mui/icons-material";
import React from "react";
import { useTranslation } from "i18n";

type MultiSelectProps<TOptions, TResult> = {
  selectProps?: SelectProps;
  name: string;
  selValue: TResult[];
  options: TOptions[];
  customOptions?: (options: TOptions[]) => React.ReactNode;
  onChange: (sections: TResult[]) => void;
  formControlProps?: FormControlProps;
  error?: string;
  transformValue?: (selected: TResult) => string;
};

export default function MultiSelect<
  TOptions extends unknown,
  TResult extends unknown
>({
  name,
  onChange,
  selValue,
  options,
  formControlProps,
  error,
  customOptions,
  transformValue,
  selectProps,
}: MultiSelectProps<TOptions, TResult>) {
  const { t } = useTranslation({ ns: "portal" });

  const onSelectChange = (event: SelectChangeEvent<TOptions>) => {
    const {
      target: { value },
    } = event;

    const sections = !value
      ? []
      : typeof value === "string"
        ? value.split(",")
        : value;

    // @ts-ignore
    onChange(sections);
  };

  return (
    <>
      <FormControl {...formControlProps} error={Boolean(error)}>
        <InputLabel id="demo-simple-select-label">{name}</InputLabel>
        <Select
          onChange={onSelectChange}
          value={selValue ?? []}
          label={name}
          placeholder={name}
          IconComponent={ExpandMore}
          fullWidth
          multiple
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {(selected as []).map((value) => {
                const newValue = transformValue ? transformValue(value) : value;
                return <Chip key={newValue} label={t(newValue)} />;
              })}
            </Box>
          )}
          endAdornment={
            Boolean(selValue.length) ? (
              <Button
                disabled={selectProps?.disabled}
                sx={{
                  display: selValue ? "" : "none",
                  right: "10px",
                  p: 0,
                  minWidth: 0,
                  backgroundColor: "transparent",
                }}
                onClick={debounce((e: any) => onChange([]), 1000)}
              >
                <Close sx={{ color: "#3F51B5" }} />
              </Button>
            ) : (
              <ExpandMore
                sx={{
                  position: "absolute",
                  right: "10px",
                  pointerEvents: "none",
                }}
              />
            )
          }
          sx={{
            pr: 0,
            minWidth: "180px",
            alignSelf: "baseline",
            "& .MuiSelect-iconOutlined": { display: selValue ? "none" : "" },
            "&.Mui-disabled": {
              opacity: 0.5,
              "&:hover": {
                background: "none",
              },
            },
          }}
          inputProps={{
            sx: {
              borderColor: "#676E76 !important",
              lineHeight: 1,
              "&:focus": {
                boxShadow: "none",
              },
            },
          }}
          {...selectProps}
        >
          {customOptions
            ? customOptions(options)
            : (options as string[])?.map(
              (section) =>
                section && (
                  <MenuItem key={section} value={section}>
                    {section}
                  </MenuItem>
                )
            )}
        </Select>
        {error && (
          <FormHelperText className="Mui-error">{error}</FormHelperText>
        )}
      </FormControl>
    </>
  );
}
