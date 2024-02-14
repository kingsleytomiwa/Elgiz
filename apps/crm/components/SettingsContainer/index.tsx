"use client";

import * as React from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import SettingsForm from "./SettingsForm";
import { useTranslation } from "i18n";

type Props = { settings: any; };

const SettingsContainer: React.FC<Props> = ({ settings }) => {
  const { t } = useTranslation({ ns: "portal" });

  return (
    <>
      <Toolbar />
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Typography
          variant="h4"
          sx={{ position: "relative" }}
        >
          {t("settings")}
        </Typography>
      </Box>

      <Box sx={{ width: '100%', marginTop: 5 }}>
        <SettingsForm
          defaultValues={settings}
          isLoading={false}
        />
      </Box>
    </>
  );
};

export default SettingsContainer;
