import { Box, CircularProgress } from "@mui/material";
import { useSpaPositions } from "lib/use-fetch";
import React from "react";
import { SpaPosition } from "@prisma/client";
import SPACard from "../SPACard";
import i18next from "i18next";

type MenuProps = {
	onCheck: (item: SpaPosition) => void;
	selectedSPA?: SpaPosition;
	showSelectedOnly?: boolean;
};

const SPAMenu: React.FC<MenuProps> = ({ selectedSPA, onCheck, showSelectedOnly }) => {
	const { data: positions, isLoading: isSpaPositionsLoading, isValidating: isSpaPositionsValidating, mutate: mutatePositions } = useSpaPositions();
	const isLoading = isSpaPositionsLoading || isSpaPositionsValidating;

	return (
		<>
			{isLoading && (
				<Box sx={{ overflow: "hidden" }}>
					<CircularProgress />
				</Box>
			)}
			{positions?.map((item, index) => {
				const isSelected = item.id === selectedSPA?.id;
				if (showSelectedOnly && !isSelected) return;

				return (
					<SPACard
						key={item.name?.[i18next.language] ?? index}
						item={{
							id: item.id,
							description: item.description?.[i18next.language],
							name: item.name?.[i18next.language],
							price: +(item.price?.toFixed(2)),
							image: item.imageURL,
							isChecked: item.id === selectedSPA?.id
						}}
						onCheck={() => onCheck(item)}
					/>
				);
			})}
		</>
	)
};

export default SPAMenu;
