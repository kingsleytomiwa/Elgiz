"use client";

import { Search } from "@mui/icons-material";
import { Box, OutlinedInput, Paper, TablePagination, Toolbar, Typography } from "@mui/material";
import { format } from "date-fns";
import { useMessageThreads } from "lib/use-fetch";
import Link from "next/link";
import React, { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "i18n";
import Chat from "../Chat";

interface Props {}

const Table: React.FC<Props> = () => {
  const { t } = useTranslation({ ns: "portal" });
  const [config, setConfig] = useState({
    page: 0,
    take: 10,
    search: "",
  });

  const debouncedConfig = useDebounce(config, 700);
  const { data: threads } = useMessageThreads(debouncedConfig);
  const params = useSearchParams();

  return (
    <>
      <Toolbar />

      <Typography variant="h4">{t("chat")}</Typography>

      <Paper sx={{ mt: 4, px: 3, py: 4, gap: 2, display: "flex", alignItems: "center" }}>
        <OutlinedInput
          onChange={(e) =>
            config.search !== e.target.value &&
            setConfig((prevState) => ({ ...prevState, search: e.target.value }))
          }
          placeholder="Поиск по чатам"
          startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          gap: 0,
          mt: 4,
        }}
      >
        <Box sx={{ width: "420px" }}>
          {threads?.data.map((item) => (
            <Link href={`/chat?guest=${item.guestId}`} key={item.guestId}>
              <Box
                sx={{
                  borderBottom: "1px solid #868A91",
                  py: 1,
                  borderRight: "1px solid #868A91",
                  pr: 2,
                  cursor: "pointer",
                }}
              >
                <Box
                  alignItems="center"
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Box alignItems="center" display={"flex"} flexDirection={"row"}>
                    {!item.wasRead && item.senderId === item.guestId && (
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          backgroundColor: "#3F51B5",
                          marginRight: "8px",
                        }}
                      />
                    )}

                    <Typography typography={`subtitle1`}>
                      {item.guest.name} - {item.guest.room}
                    </Typography>
                  </Box>

                  <Typography typography={`subtitle2`}>
                    {format(new Date(item.createdAt!), "HH:mm")}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#868A91",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  variant="body1"
                >
                  {item.text}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
        {params?.get("guest") && <Chat guestId={params.get("guest") as string} />}
      </Box>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={threads?.total || 0}
        rowsPerPage={config.take}
        labelRowsPerPage={t("records_on_the_page")}
        page={config.page}
        onPageChange={(event: unknown, newPage: number) => {
          setConfig((prevState) => ({ ...prevState, page: newPage }));
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setConfig((prevState) => ({ ...prevState, page: 0, take: +event.target.value }));
        }}
      />
    </>
  );
};

export default Table;
