import { UsePositionsCountHook } from "lib/use-fetch";
import { Dialog } from "ui";
import { DialogProps } from "ui/src/Dialog";
import { Box, Typography, CircularProgress } from "@mui/material";
import React from "react";

type Props = Omit<DialogProps, "children"> & {
	title?: string;
	children?: React.ReactNode;
};

const ConfirmationDialog = ({ title, children, ...dialogProps }: Props) => {
	return (
		<>
			<Dialog
				{...dialogProps}
				sx={{ p: 3, width: "550px" }}
			>
				{title && <Typography sx={{ fontSize: "14px", lineHeight: "24px", fontWeight: 600, mb: 3 }}>
					{title}
				</Typography>}

				{children}

				{dialogProps.isDisabled && (
					<Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
						<CircularProgress />
					</Box>
				)}
			</Dialog>
		</>
	)
}

export default ConfirmationDialog;