"use client";

import * as React from "react";
import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  DialogActions,
  DialogContent,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
} from "@mui/material";
import { useTranslation } from "i18n";

export type DialogProps = React.PropsWithChildren & {
  isOpened: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  onCancel: () => void;
  onSubmit?: () => void;
  onDelete?: (() => void) | null;
  sx?: MuiDialogProps["sx"];
  buttons?: boolean;
};

export default function Dialog({
  sx,
  isOpened,
  isDisabled = false,
  onSubmit,
  onCancel,
  onDelete = null,
  children,
  buttons = true,
}: DialogProps) {
  const { t } = useTranslation({ ns: "portal" });
  
  return (
    <Box>
      <MuiDialog
        onClose={onCancel}
        aria-labelledby="customized-dialog-title"
        open={isOpened}
        disablePortal
        PaperProps={{ sx: { maxWidth: "unset" } }}
      >
        <DialogContent
          sx={{
            ...sx,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ mb: 12 }}>{children}</Box>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              p: 0,
            }}
          >
            {onDelete && (
              <Button
                autoFocus
                onClick={onDelete}
                sx={{ borderRadius: "20px", justifyContent: "flex-start" }}
              >
                <Delete sx={{ color: "#F23838", fontSize: "24px" }} />
                <Typography sx={{ fontSize: 13, color: "#F23838", mr: 2 }}>
                  {t("delete")}
                </Typography>
              </Button>
            )}
            {buttons && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  autoFocus
                  onClick={onCancel}
                  sx={{ borderRadius: "20px", fontSize: 16, mr: 2 }}
                >
                  {t("cancellation")}
                </Button>

                <Button
                  onClick={onSubmit}
                  disabled={isDisabled}
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: "20px",
                    fontSize: 16,
                    backgroundColor: "#3F51B5",
                    maxWidth: "190px",
                  }}
                  type="submit"
                  variant="contained"
                >
                  {t("confirm")}
                </Button>
              </Box>
            )}
          </DialogActions>
        </DialogContent>
      </MuiDialog>
    </Box>
  );
}
