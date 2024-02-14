import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box } from "@mui/material";
import { format } from "date-fns";
import { ToolbarProps } from "react-big-calendar";

export const getRandomColor = () => {
	const num = Math.floor(Math.random() * 3);
	let color;

	switch (num) {
		case 0:
			color = "#9B51E0";
			break;
		case 1:
			color = "#6FCF97";
			break;
		case 2:
			color = "#F2C94C";
			break;
	}

	return color;
}

export function RBCToolbar({ date, onNavigate }: ToolbarProps) {
	const goToBack = () => {
		onNavigate("PREV");
	};
	const goToNext = () => {
		onNavigate("NEXT");
	};

	return (
		<Box sx={{ display: "flex", gap: 3, mb: 3 }}>
			<Box sx={{ display: "flex", gap: 3 }}>
				<Box sx={{ cursor: "pointer" }} onClick={goToBack}><ChevronLeft sx={{ transform: "scale(1.2)" }} /></Box>
				<Box sx={{ cursor: "pointer" }} onClick={goToNext}><ChevronRight sx={{ transform: "scale(1.2)" }} /></Box>
			</Box>
			<Box sx={{ fontWeight: 700, color: "#121828", fontSize: "14px" }}>
				{format(date, "MMMM yyyy")}
			</Box>
		</Box>
	);
}