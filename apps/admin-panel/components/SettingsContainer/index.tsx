"use client";

import * as React from "react";
import { Box, Toolbar, Typography } from "@mui/material";
import { Drawer } from "ui";
import SettingsForm from "./SettingsForm";
import { useSettings } from "lib/use-fetch";
import { menuLinks } from "src/constants";

type Props = { userId: string };

const SettingsContainer: React.FC<Props> = ({ userId }) => {
  const { data, isLoading } = useSettings({ userId });

  return (
    <Box>
      <Toolbar />
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Typography variant="h4" sx={{ position: "relative" }}>
          Настройки
        </Typography>
      </Box>

      <Box sx={{ width: "100%", marginTop: 5 }}>
        <SettingsForm defaultValues={data} isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default SettingsContainer;
