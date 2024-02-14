import { Box } from '@mui/material';
import Detail from 'components/Detail';
import Sidebar from 'components/Sidebar';
import { TableGuest } from 'db';
import React from 'react';
import { format } from "date-fns";
import { dateTimeFormat } from 'utils';
import { Review } from '@prisma/client';
import { useTranslation } from 'i18n';

export type ReviewWithGuest = Review & { guest: Pick<TableGuest, "name" | "room">; };
interface Props {
	review?: ReviewWithGuest;
	setReview: React.Dispatch<React.SetStateAction<ReviewWithGuest | undefined>>;
}

const ReviewRequestDetails: React.FC<Props> = ({ review, setReview }) => {
	const { t } = useTranslation({ ns: "portal" });

	return (
		<Sidebar
			onClose={() => setReview(undefined)}
			isOpened={!!review}
			title='Детали отзыва'
		>
			{review && (
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 6,
						pl: 9,
						pb: 5,
					}}
				>
					{(
						[
							{
								title: "Номер отзыва",
								description: review.id,
								containerSx: { gridColumn: "span 2" }
							},
							{
								title: t("guest"),
								description: review?.guest.name,
							},
							{
								title: t("room"),
								description: review?.guest.room,
							},
							{
								title: t("request_time"),
								description: format(new Date(review.createdAt!), dateTimeFormat),
								containerSx: { gridColumn: "span 2" }
							},
							{
								title: "review",
								description: review.text
							},
						]
					).map((detail) => (
						<Detail
							key={detail.title}
							{...detail}
						/>
					))}
				</Box>
			)}
		</Sidebar>
	);
};

export default ReviewRequestDetails;

