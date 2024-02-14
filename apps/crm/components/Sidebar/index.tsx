"use client";

import * as React from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { useTranslation } from 'i18n';

export type SidebarProps = React.PropsWithChildren & {
  title: string;
  onClose?: () => void;
  isOpened?: boolean;
}

export default function Sidebar({ title, onClose, isOpened = true, children }: SidebarProps) {
  const { t } = useTranslation({ ns: "portal" });
  
  return (
    <div>
      <Drawer
        anchor="right"
        open={isOpened}
        onClose={onClose}
      >
        {/* container */}
        <Box sx={{ width: "600px", pt: 6 }}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, pl: 2, mb: 6 }}>
            <Box>
              <Button
                sx={{ width: "24px", heigth: "24px", minWidth: 0, color: "#000" }}
                onClick={onClose}
              >
                <KeyboardDoubleArrowLeft />
              </Button>
            </Box>

            <Typography sx={{ fontSize: "32px", fontWeight: 700, lineHeight: "44px", color: "#121828" }}>
              {t(title)}
            </Typography>
          </Box>

          {/* children */}
          {children}
        </Box>
      </Drawer>
    </div>
  );
}
