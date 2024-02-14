"use client";

import * as React from "react";
import {
    Box,
    Typography,
} from "@mui/material";
import { useShopCategories, useShopPositionsCount } from "lib/use-fetch";
import { useTranslation } from "i18n";
import CategoriesSection from "components/CategoriesSection";
import { onAddCategory, onDeleteCategory, onDragItem } from "./actions";
import Menu from "./Menu";

const ShopContainer = () => {
    const { t } = useTranslation({ ns: "portal" });

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography
                    sx={{
                        color: "#374151",
                        fontSize: "12px",
                        lineHeight: "12px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        mb: 1,
                        opacity: 0.5,
                    }}
                >
                    {t("catalog")}
                </Typography>

                <Typography
                    sx={{
                        color: "#121828",
                        fontSize: "14px",
                        maxWidth: "670px"
                    }}
                >
                    {t("categories_will_be_displayed_in_the_application_of_the_guest_in_the_same_order_as_are_located_below")}
                </Typography>
            </Box>

            <CategoriesSection
                useData={useShopCategories}
                useDataCount={useShopPositionsCount}
                deleteAction={onDeleteCategory}
                action={onAddCategory}
                onDragItem={onDragItem}
            />

            <Box sx={{ maxWidth: "650px" }}>
                <Menu isEdit showEmpty />
            </Box>
        </>
    );
};

export default ShopContainer;
