import * as React from "react";
import Button from "@mui/material/Button";
import MuiDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

type InfoDialogProps = {
  isOpened: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

export default function InfoDialog({ isOpened, onSubmit, onCancel, title, message }: InfoDialogProps) {
  return (
    <div>
      <MuiDialog
        onClose={onCancel}
        aria-labelledby="customized-dialog-title"
        open={isOpened}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
        >
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 2 }}>
          <Typography gutterBottom>
            {message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button
            autoFocus
            onClick={onSubmit}
          >
            Окей
          </Button>
        </DialogActions>
      </MuiDialog>
    </div>
  );
}
