"use client";

import { Button, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import React from "react";
import Form from "./Form";
import { useTranslation } from "i18n";
import { ParameterType } from "@prisma/client";

export default function ParametersForm({ title, type, fields }: { title?: string, type: ParameterType; fields: string[]; }) {
	const [isOpened, setIsOpened] = React.useState(false);
	const { t } = useTranslation({ ns: "portal" });

	return (
		<>
			<Button
				startIcon={<Settings sx={{ fill: "#3F51B5" }} />}
				onClick={() => setIsOpened(true)}
			>
				<Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
					{t("settings")}
				</Typography>
			</Button>

			{isOpened && <Form fields={fields} type={type} title={title} isOpened={isOpened} setIsOpened={setIsOpened} />}
		</>
	);
}
