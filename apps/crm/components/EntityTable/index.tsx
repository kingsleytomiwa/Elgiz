"use client";

import * as React from "react";
import {
  Table as MuiTable,
  Paper,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useHandleParams } from "src/hooks";
import { useTranslation } from "i18n";

export interface Column<T extends { id: string; }> {
  key: keyof T;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: T[keyof T], item: T) => string;
}

interface Props<T extends { id: string; }> {
  data: T[];
  isLoading: boolean;
  needsPagination?: boolean;
  columns: Column<T>[];
  total?: number;
  take?: number;
  page?: number;
  onPageChange?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    page: number
  ) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (data: T) => void;
  shouldSetParams?: boolean;
}

export default function EntityTable<T extends { id: string; }>({
  data,
  isLoading,
  columns,
  total,
  take,
  page,
  onPageChange,
  onRowsPerPageChange,
  onSelect,
  needsPagination = true,
  shouldSetParams = true,
}: Props<T>) {
  const _handleParams = useHandleParams();
  const { t } = useTranslation({ ns: "portal" });
  const handleParams = (params: [string, string][], rutheless = false) => {
    if (shouldSetParams) {
      _handleParams(params, rutheless);
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        sx={{
          // maxHeight: 440,
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
              {columns.map((column, index) => (
                <TableCell
                  key={`${String(column.key)}_${index}`}
                  align={column.align}
                  style={{
                    width: column.minWidth,
                    backgroundColor: "#F3F4F6",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {t(column.label)}
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
                {data.map((row) => (
                  <TableRow
                    hover
                    onClick={() => {
                      handleParams([["selected", row.id]], true);
                      onSelect?.(row);
                    }}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    {columns.map((column, index) => {
                      const value = row[column.key];
                      const formatted: any = column.format?.(value, row) ?? value;

                      return (
                        <TableCell
                          key={`${row.id}-${String(column.key)}-${index}`}
                          align={column.align}
                          sx={{ color: "#121828" }}
                        >
                          {index === 0 ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {formatted}
                            </Box>
                          ) : (
                            formatted
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

      {needsPagination && take && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total ?? 0}
          rowsPerPage={take}
          labelRowsPerPage={t("records_on_the_page")}
          page={page ?? 1}
          onPageChange={(e, page) => {
            onPageChange?.(e, page);
            handleParams([["page", String(page)]]);
          }}
          onRowsPerPageChange={(event) => {
            onRowsPerPageChange?.(event as any);
            handleParams([["take", event.target.value]]);
          }}
        />
      )}
    </Paper>
  );
}
