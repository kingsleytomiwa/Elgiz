"use client";

import { Add } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { SpaPosition } from "@prisma/client";
import Position from "components/AddRequestForm/Position";
import { useSpaPositions } from "lib/use-fetch";
import React from "react";
import AddPositionForm from "./AddPositionForm";
import { deleteSpaPosition } from "./AddPositionForm/actions";
import { useTranslation } from "i18n";
import i18next from "i18next";

const ServicesCatalog = ({ hotelId }: { hotelId: string; }) => {
	const [position, setPosition] = React.useState<Partial<SpaPosition> | null>(null);
	const [isDeleting, setIsDeleting] = React.useState(false);
	const { t } = useTranslation({ ns: "portal" });

	const { data: positions, isLoading: isSpaPositionsLoading, isValidating, mutate: mutatePositions } = useSpaPositions();
	const isEdit = true;
	const isPositionsLoading = isSpaPositionsLoading || isValidating || isDeleting;

	const onDelete = async () => {
		if (!position?.id) return;

		try {
			setIsDeleting(true);
			setPosition(null);

			await deleteSpaPosition(position.id);
			mutatePositions();

			setIsDeleting(false);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Box sx={{ mb: 2, mt: 7 }}>
				<Typography
					sx={{
						color: "#374151",
						fontSize: "12px",
						lineHeight: "12px",
						letterSpacing: "0.5px",
						textTransform: "uppercase",
						fontWeight: 600,
						mb: 1,
						opacity: 0.5
					}}
				>
					{t("catalog")}
				</Typography>
			</Box>

			<Box sx={{ maxWidth: "650px" }}>
				<Box>
					<Button
						startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
						sx={{ border: "1px solid #2B3467", mt: 2, opacity: (isPositionsLoading) ? 0.5 : 1, borderRadius: "5px", height: "32px" }}
						onClick={() => setPosition({ hotelId })}
						disabled={isPositionsLoading}
					>
						<Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
							{t("add_the_procedure")}
						</Typography>
					</Button>

					{position && (
						<AddPositionForm
							mutate={mutatePositions}
							isDisabled={isPositionsLoading}
							position={position}
							onDelete={position?.id ? onDelete : null}
							onClose={() => setPosition(null)}
						/>
					)}
				</Box>

				{isPositionsLoading && (
					<CircularProgress sx={{ my: 2 }} />
				)}
				{positions?.map((position) => {
					return (
						<Position
							key={(position.name as any)?.[i18next.language]}
							position={{
								name: position?.name?.[i18next.language],
								description: position?.description?.[i18next.language],
								caption: position?.duration ? `${position.duration / 60000} ${t("minutes")}` : "",
								imageURL: position?.imageURL,
								price: Number(position?.price?.toFixed(2))
							}}
							onEdit={isEdit ? () => { setPosition(position); } : undefined}
							isDisabled={isPositionsLoading}
						/>
					);
				})}
			</Box>
		</>
	);
};

export default ServicesCatalog;