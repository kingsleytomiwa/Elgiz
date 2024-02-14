import { Box, FormControl, FormControlLabel, RadioGroup, Typography } from "@mui/material";
import { RequestType } from "@prisma/client";
import { FormikHandlers } from "formik";
import { useTranslation } from "i18n";
import { Radio } from "ui";
import { RequestPaymentPlaceType, RequestPaymentType } from "utils";

const PaymentRadios = ({ isDisabled, handleChange, values }: {
	isDisabled: boolean;
	handleChange: FormikHandlers["handleChange"];
	values: Record<string, unknown>;
}) => {
	const { t } = useTranslation({ ns: "portal" });
	
	return (
	<Box sx={{ width: "100%" }}>
		<Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
			<Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>
				5
			</Typography>

			<Box>
				<FormControl sx={{ fontSize: "16px", lineHeight: "24px" }}>
					<Typography sx={{ fontSize: "16px", lineHeight: "24px" }}>
						{t("payment")}:
					</Typography>

					<RadioGroup
						name="paymentPlace"
						value={values.paymentPlace}
						onChange={handleChange}
					>
						<FormControlLabel
							value={RequestPaymentPlaceType.ROOM}
							control={<Radio disabled={isDisabled} />}
							label={t("in_the_room")} />

						{values.paymentPlace === "ROOM" && (
							<RadioGroup
								name="paymentType"
								value={values.paymentType}
								onChange={handleChange}
								sx={{ pl: 3 }}
							>
								<FormControlLabel
									value={RequestPaymentType.CASH}
									control={<Radio disabled={isDisabled} />}
									label={t("cash")} />
								<FormControlLabel
									value={RequestPaymentType.CARD}
									control={<Radio disabled={isDisabled} />}
									label={t("payment_by_card_visa_mastercard")} />
							</RadioGroup>
						)}

						<FormControlLabel
							value={RequestPaymentPlaceType.AT_CHECKOUT}
							control={<Radio disabled={isDisabled} />}
							label={t("payment_at_departure")} />
					</RadioGroup>
				</FormControl>
			</Box>
		</Box>
	</Box>
)}

export default PaymentRadios;
