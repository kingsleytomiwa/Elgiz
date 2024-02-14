"use client";

import {
  Paper,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";
import React from "react";
import { getCellColor } from "./utils";

const Table = ({ columns, rows, onRowClick, activeRow, isLoading }) => {
  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          sx={{
            minHeight: rows?.length ? "none" : "130px",
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
          <MuiTable stickyHeader>
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
                <TableRow sx={{ position: "relative" }}>
                  <TableCell>
                    <Box sx={{ position: "absolute", left: "50%", translate: "-50%" }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: "pointer" }}
                        onClick={onRowClick ? () => onRowClick(row.id) : () => { }}
                      >
                        {columns.map((column) => {
                          const isActive = activeRow === row.id;

                          const cellStyles = getCellColor(isActive, column.id, row?.isPaid);

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={cellStyles}
                            >
                              {row[column.id]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </MuiTable>
        </TableContainer>
      </Paper>
    </>
  );
};

export default Table;
