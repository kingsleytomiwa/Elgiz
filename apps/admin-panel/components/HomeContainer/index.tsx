"use client";

import * as React from "react";
import {
  FormControl,
  Table as MuiTable,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Box,
  Button,
  Typography,
  Toolbar,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  debounce,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Drawer } from "ui";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import {
  BackHandOutlined,
  Delete,
  ExpandMore,
  Search,
  PeopleOutlined,
  Add,
  Close,
} from "@mui/icons-material";
import { Hotel } from "@prisma/client";
import * as dateFns from "date-fns";
import { dateTimeFormat } from "utils";
import { useDebounce } from "usehooks-ts";
import { useHotels } from "lib/use-fetch";
import { menuLinks } from "src/constants";

interface Column {
  id: "name" | "country" | "guestsAmount" | "previousPayment" | "nextPayment";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Название отеля", minWidth: 200 },
  { id: "country", label: "Страна", minWidth: 200 },
  {
    id: "guestsAmount",
    label: "Гостей",
    minWidth: 200,
    align: "right",
  },
  {
    id: "previousPayment",
    label: "Предыдущий платеж",
    minWidth: 200,
    align: "right",
  },
  {
    id: "nextPayment",
    label: "Следующий платеж",
    minWidth: 200,
    align: "right",
  },
];

interface Data {
  id: string;
  name: string;
  country: string;
  guestsAmount: number;
  previousPayment: string;
  nextPayment: string;
  deleted: boolean | null;
  suspended: boolean | null;
}

function createHotelsData(
  id: string,
  name: string,
  country: string,
  guestsAmount: number | null,
  previousPayment: string | null = "",
  nextPayment: string | null = "",
  deleted: boolean | null,
  suspended: boolean | null
): Data {
  return {
    id,
    name,
    country,
    guestsAmount: guestsAmount ?? 0,
    previousPayment: previousPayment ?? "-",
    nextPayment: nextPayment ?? "-",
    deleted,
    suspended,
  };
}

export type HotelsTableQuery = {
  country?: string;
  showSuspended?: boolean;
  showDeleted?: boolean;
};

const HomeContainer = () => {
  const { push } = useRouter();

  const [config, setConfig] = React.useState({
    page: 0,
    take: 10,
    search: "",
    country: "",
    showSuspended: true,
    showDeleted: true,
  });

  const debouncedConfig = useDebounce(config, 700);
  const { data, isLoading } = useHotels(debouncedConfig);

  const { hotels, countries, total } = React.useMemo(() => {
    const hotels = (data?.data?.[1] as any[])?.map(
      ({ id, name, country, guestsAmount, deleted, suspended, payments }) => {
        const [startDate, endDate] = [payments?.[0]?.startDate, payments?.[0]?.endDate];
        return createHotelsData(
          id,
          name!,
          country!,
          guestsAmount,
          startDate ? dateFns.format(new Date(startDate), dateTimeFormat) : "-",
          endDate ? dateFns.format(new Date(endDate), dateTimeFormat) : "-",
          deleted,
          suspended
        );
      }
    );

    const countries = (data?.data?.[0] as Hotel[])?.map((country) => country?.country);

    return { hotels, countries, ...data };
  }, [data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setConfig((prevState) => ({ ...prevState, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prevState) => ({ ...prevState, page: 0, take: +event.target.value }));
  };

  const onSearch = (e) =>
    config.search !== e.target.value &&
    setConfig((prevState) => ({ ...prevState, search: e.target.value }));
  const onSelectChange = (e) =>
    config.country !== e.target.value &&
    setConfig((prevState) => ({ ...prevState, country: e.target.value }));
  const onShowSuspendedChange = (e) =>
    setConfig((prevState) => ({ ...prevState, showSuspended: !prevState.showSuspended }));
  const onShowDeletedChange = (e) =>
    setConfig((prevState) => ({ ...prevState, showDeleted: !prevState.showDeleted }));

  return (
    <>
      <Toolbar />
      <Typography variant="h4">Отели</Typography>
      <Box
        sx={{
          mt: 3,
          px: 3,
          pb: 1,
          pt: 4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "350px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow:
            "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)",
        }}
      >
        <Stack spacing={2}>
          <Typography
            sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "30px", color: "#65748B" }}
          >
            ВСЕГО ОТЕЛЕЙ
          </Typography>
          <Typography
            sx={{ fontSize: "32px", fontWeight: 700, lineHeight: "44px", color: "#121828" }}
          >
            {total}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: "56px",
            height: "56px",
            borderRadius: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#14B8A6",
          }}
        >
          <PeopleOutlined sx={{ fill: "white" }} />
        </Box>
      </Box>

      {/* FILTERS */}
      <Paper sx={{ mt: 3, px: 3, py: 4, gap: 2, display: "flex", alignItems: "center" }}>
        <OutlinedInput
          onChange={onSearch}
          placeholder="Поиск отеля"
          startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
        />

        <FormControl>
          <InputLabel id="demo-simple-select-label">Страна</InputLabel>
          <Select<string>
            onChange={onSelectChange}
            value={config.country ?? ""}
            label="Страна"
            placeholder="Страна"
            IconComponent={ExpandMore}
            fullWidth
            renderValue={() => (
              <Typography
                sx={{
                  color: config.country ? "black" : "#676E76",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {config.country === "" ? "Страна" : config.country}
              </Typography>
            )}
            endAdornment={
              <Button
                sx={{
                  display: config.country ? "" : "none",
                  p: 0,
                  minWidth: 0,
                  backgroundColor: "transparent",
                }}
                onClick={debounce(
                  (e) => setConfig((prevState) => ({ ...prevState, country: e.target.value })),
                  1000
                )}
              >
                <Close sx={{ color: "#3F51B5" }} />
              </Button>
            }
            sx={{
              minWidth: "180px",
              alignSelf: "baseline",
              "& .MuiSelect-iconOutlined": { display: config.country ? "none" : "" },
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
          >
            {countries?.map(
              (country) =>
                country && (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>

        <FormControlLabel
          sx={{ mr: 0 }}
          label="Показать остановленные отели"
          control={<Checkbox onChange={onShowSuspendedChange} checked={config?.showSuspended} />}
        />

        <FormControlLabel
          sx={{ mr: 0 }}
          label="Показать удаленные отели"
          control={<Checkbox onChange={onShowDeletedChange} checked={config?.showDeleted} />}
        />
      </Paper>

      {/* ADD HOTEL */}
      <Button
        startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
        sx={{ border: "1px solid #2B3467", my: 4, borderRadius: "5px" }}
        onClick={() => push("/add-hotel")}
      >
        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>Добавить отель</Typography>
      </Button>

      {/* TABLE */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          sx={{
            maxHeight: 440,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },
            "&::-webkit-scrollbar-track": {
              background: "white",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#bfbfbf",
              borderRadius: "10px",
            },
          }}
        >
          <MuiTable stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: "#F3F4F6",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell>
                    <Box sx={{ position: "absolute", left: "50%" }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {hotels?.map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                      sx={{ cursor: "pointer" }}
                      onClick={() => push(`/hotel/${row.id}`)}
                    >
                      {columns.map((column, index) => {
                        const value = row[column.id];

                        let styles = {
                          color: row.deleted ? "#F23838" : row.suspended ? "#FFA700" : "#121828",
                        };

                        return (
                          <TableCell key={column.id} align={column.align} sx={styles}>
                            {index === 0 ? (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {row.deleted && <Delete sx={{ fill: "#F23838", fontSize: 20 }} />}
                                {!row.deleted && row.suspended && (
                                  <BackHandOutlined sx={{ fill: "#FFA700", fontSize: 20 }} />
                                )}
                                {value}
                              </Box>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total ?? 0}
          rowsPerPage={config.take}
          labelRowsPerPage="Записей на странице"
          page={config.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default HomeContainer;
