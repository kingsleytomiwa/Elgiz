"use client";

import React, { useCallback } from "react";
import {
    Box,
    Paper,
    OutlinedInput,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { DateRangePickerInput, MultiSelect } from "ui";
import { Category, RequestType } from "@prisma/client";
import { CategoryLabel, RequestTypeLabel } from "utils";
import { Search } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import { sectionOptions } from "src/utils/constants";
import { useParamsState } from "src/hooks";
import { useTranslation } from "i18n";

interface Props {
    categories?: Category[];
    types?: RequestType[];
}

const Filters: React.FC<Props> = ({
    categories = sectionOptions.filter(section => section !== Category.CHAT),
    types = Object.values(RequestType).map((section) => RequestType[section]),
}) => {
    const { t } = useTranslation({ ns: "portal" });

    const [config, setConfig] = useParamsState({
        page: 0,
        take: 10,
        search: "",
        type: [] as RequestType[],
        category: [] as Category[],
        startDate: null,
        endDate: null,
        showCompleted: false,
    });

    const onShowCompletedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
        setConfig(({ showCompleted: e.target.checked })), [setConfig]);

    const onPeriodChange = useCallback((update) => {
        if (update[0] || (update[0] && update[1])) {
            setConfig(({
                startDate: update[0] as never,
                endDate: update[1] ? (update[1] as never) : null,
            }));
        } else {
            setConfig(({ startDate: null, endDate: null }));
        }
    }, [setConfig]);

    return (
        <Paper
            sx={{
                mt: 3,
                px: 3,
                py: 4,
                gap: 2,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
            }}
        >
            <OutlinedInput
                onChange={e => setConfig({ search: e.target.value })}
                placeholder={t("search_by_the_guest")}
                startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
            />

            {!!categories.length && (
                <MultiSelect
                    name={t("chapter")}
                    options={categories}
                    onChange={(newSections: Category[]) =>
                        setConfig({ category: newSections })
                    }
                    selValue={config.category}
                    transformValue={(selected) => CategoryLabel[selected]}
                    customOptions={(options) => {
                        return options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(CategoryLabel[option])}
                            </MenuItem>
                        ));
                    }}
                />
            )}

            {!!types.length && (
                <MultiSelect
                    name={t("request")}
                    options={types}
                    onChange={(newTypes: RequestType[]) =>
                        setConfig({ type: newTypes })
                    }
                    selValue={config.type}
                    transformValue={(selected) => RequestTypeLabel[selected]}
                    customOptions={(options) => {
                        return options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(RequestTypeLabel[option])}
                            </MenuItem>
                        ));
                    }}
                />
            )}

            <Box sx={{ width: "300px" }}>
                <DatePicker
                    customInput={<DateRangePickerInput />}
                    placeholderText={t("request_time")}
                    selectsRange={true}
                    startDate={config?.startDate}
                    endDate={config?.endDate}
                    onChange={onPeriodChange}
                    isClearable={true}
                />
            </Box>

            <FormControlLabel
                sx={{ mr: 0 }}
                label={t("show_the_executed_queries")}
                control={<Checkbox onChange={onShowCompletedChange} checked={config?.showCompleted} />}
            />
        </Paper>
    );
};

export default Filters;
