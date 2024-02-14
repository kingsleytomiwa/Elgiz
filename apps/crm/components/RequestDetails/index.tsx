import { Delete } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Detail, { DetailProps } from "components/Detail";
import Sidebar, { SidebarProps } from "components/Sidebar";
import React from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { DialogProps } from "ui/src/Dialog";
import { useTranslation } from "i18n";

export type RequestDetailsBaseProps = Pick<SidebarProps, "isOpened" | "onClose"> & {
	dialogProps: Required<Pick<DialogProps, "isDisabled" | "onSubmit">> & {
		title: string;
	};
};

type Props = React.PropsWithChildren & RequestDetailsBaseProps & {
	title: string;
	details: DetailProps[];
};

const RequestDetails = ({ onClose, dialogProps, isOpened, details, children, title = "" }: Props) => {
	const [isOpenedConfirmation, setIsOpenedConfirmation] = React.useState(false);
	const { t } = useTranslation({ ns: "portal" });

	const onCloseConfirmation = () => setIsOpenedConfirmation(false);

	const extendedDetails: typeof details = [
		...details,
		{
			title: "",
			description: (
				<>
					{dialogProps
						? (
							<Button
								startIcon={<Delete sx={{ fill: "#F23838", fontSize: 24 }} />}
								sx={{
									"& .MuiButton-startIcon": { mr: 0, ml: 0, "&>*:nth-of-type(1)": { fontSize: 24 } },
									borderRadius: "5px",
									height: "32px",
									width: 80,
									minWidth: 0,
									transform: "translateY(-30px)"
								}}
								onClick={() => setIsOpenedConfirmation(true)}
							>
								<Typography sx={{ color: "#F23838", ml: 0.5, fontSize: "13px" }}>
									{t("delete")}
								</Typography>
							</Button>
						) : <></>}
				</>
			)
		}
	]

	return (
		<Sidebar
			title={title}
			onClose={onClose}
			isOpened={isOpened}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "auto auto",
					gap: 6,
					pl: 9,
					pb: "12px",
					borderBottom: "1px solid #00000040",
				}}
			>
				{extendedDetails.map((detail) => (
					<Detail
						key={detail.title}
						{...detail}
					/>
				))}
			</Box>

			{dialogProps.onSubmit && (
				<ConfirmationDialog
					{...dialogProps}
					isOpened={isOpenedConfirmation}
					onCancel={onCloseConfirmation}
					onSubmit={async() => {
						await dialogProps.onSubmit?.();
						onCloseConfirmation();
					}}
				/>
			)}
			{children}
		</Sidebar>
	);
}

export default RequestDetails;
