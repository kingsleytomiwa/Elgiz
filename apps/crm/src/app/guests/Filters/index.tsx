"use client";

import React, { useState } from "react";
import {
  OutlinedInput,
  Paper,
  Typography,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import RangePicker from "components/RangePicker";
import { useParamsState } from "src/hooks";
import CreateEditGuest from "../CreateEditGuest";
import { useTranslation } from 'i18n';

const Filters: React.FC = () => {
  const { t } = useTranslation({ ns: "portal" });
  const [config, setConfig] = useParamsState({
    page: 0,
    take: 10,
    search: '',
    startDateStart: null as null | Date,
    startDateEnd: null as null | Date,
    endDateStart: null as null | Date,
    endDateEnd: null as null | Date,
    suspended: false
  });

  const [modal, setModal] = useState(false);

  return (
    <>
      <Paper sx={{ mt: 10, px: 3, py: 4, gap: 2, display: "flex", alignItems: "center" }}>
        <OutlinedInput
          onChange={(e) => setConfig({ search: e.target.value })}
          placeholder={t("search_for_a_guest")}
          startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
        />

        <Box
          sx={{
            width: "320px",
          }}
        >
          <RangePicker
            placeholder={t("arrival_date")}
            start={config.startDateStart}
            end={config.startDateEnd}
            setStart={(d) =>
              setConfig({
                startDateStart: d,
              })
            }
            setEnd={(d) =>
              setConfig({
                startDateEnd: d,
              })
            }
          />
        </Box>

        <Box
          sx={{
            width: "320px",
          }}
        >
          <RangePicker
            placeholder={t("date_of_departure")}
            start={config.endDateStart}
            end={config.endDateEnd}
            setStart={(d) =>
              setConfig({
                endDateStart: d,
              })
            }
            setEnd={(d) =>
              setConfig({
                endDateEnd: d,
              })
            }
          />
        </Box>

        <FormControlLabel
          sx={{ mr: 0 }}
          label={t("show_blocked_guests")}
          control={
            <Checkbox
              onChange={e => setConfig({ suspended: e.target.checked })}
              checked={!!config?.suspended}
            />
          }
        />
      </Paper>

      <Button
        startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
        sx={{ border: "1px solid #2B3467", my: 4, borderRadius: "5px" }}
        onClick={() => setModal(true)}
      >
        <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
          {t("add_the_guest")}
        </Typography>
      </Button>

      <CreateEditGuest open={modal} setOpen={setModal} onCancel={() => setModal(false)} />
    </>
  );
};

export default Filters;
