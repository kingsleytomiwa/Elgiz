"use client";

import { Box, Typography } from "@mui/material";
import { useTranslation } from "i18n";
import { LinkTabs } from "ui";


const Tabs = () => {
	const { t } = useTranslation({ ns: "portal" });

	return (
		<Typography variant="h4">{t("profile")}</Typography>
	)
}

export default Tabs;