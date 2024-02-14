import { Add, Remove } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";

export type Dish = {
	name: string;
};

export type DishPositionProps = Dish & {
	onAdd?: () => void;
	onSubtract?: () => void;
	onClear?: () => void;
	count?: number;
	isDisabled?: boolean;
};

export default function DishPosition({
	name,
	count,
	onAdd,
	onSubtract,
	onClear,
	isDisabled = false
}: DishPositionProps) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				minWidth: 650,
				p: 2,
				pt: 4,
				justifyContent: "space-between",
				opacity: isDisabled ? 0.5 : 1
			}}
		>
			<FormControlLabel
				sx={{ display: "flex", alignItems: "center", gap: 1 }}
				label={
					<Typography sx={{ fontSize: "20px", color: "#2B3467", userSelect: "none" }}>
						{name}
					</Typography>
				}
				control={
					<Checkbox
						sx={{
							width: "16px", height: "16px",
							"& svg": {
								fill: "#2B3467"
							}
						}}
						checked={!!(count && count >= 1)}
						onClick={(count && count >= 1) ? onClear : onAdd}
						title="jpa"
					/>
				}
			/>

			<Box sx={{ display: "flex", gap: 2, alignItems: "center", justifySelf: "end" }}>
				{count && count > 0 && onSubtract ? (
					<>
						<Button
							onClick={onSubtract}
							disabled={isDisabled}
							sx={{
								border: "1px solid #1A1A1A",
								p: 1,
								minWidth: "unset",
								width: "32px",
								height: "32px",
								borderRadius: "5px",
							}}
						>
							<Remove sx={{ fontSize: "16px", color: "#1A1A1A" }} />
						</Button>

						<Typography sx={{ color: "#000", fontSize: "14px" }}>{count}</Typography>
					</>
				) : <></>}

				{onAdd && count && count >= 1 && (
					<Button
						onClick={onAdd}
						disabled={isDisabled}
						sx={{
							border: "1px solid #1A1A1A",
							p: 1,
							minWidth: "unset",
							width: "32px",
							height: "32px",
							borderRadius: "5px",
						}}
					>
						<Add sx={{ fontSize: "16px", color: "#1A1A1A" }} />
					</Button>
				)}
			</Box>
		</Box>
	);
}
