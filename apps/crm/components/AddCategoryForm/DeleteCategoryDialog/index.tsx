import { UsePositionsCountHook } from "lib/use-fetch";
import { DialogProps } from "ui/src/Dialog";
import { Typography } from "@mui/material";
import ConfirmationDialog from "components/ConfirmationDialog";

type Props = Omit<DialogProps, "children"> & {
	useDataCount: UsePositionsCountHook;
	id?: string;
};

const DeleteCategoryDialog = ({ useDataCount, isDisabled, id, ...dialogProps }: Props) => {
	const { data: count, isLoading: isDataLoading, isValidating } = useDataCount(id);

	const isLoading = isDisabled || isDataLoading || isValidating;
	return (
		<ConfirmationDialog
			{...dialogProps}
			title="Вы уверены, что хотите удалить категорию?"
			isDisabled={isLoading}
		>
			<Typography sx={{ color: "#F23838", fontSize: "16px", lineHeight: "24px" }}>
				Вместе с категорией будут удалены {count} позиций, входящих в эту категорию. Подтвердите, чтобы продолжить.
			</Typography>
		</ConfirmationDialog>
	);
};

export default DeleteCategoryDialog;