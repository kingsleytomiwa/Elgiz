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
import { Search } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import { useParamsState } from "src/hooks";
import { useTranslation } from "i18n";
import { UseSpaPositions, useSpaPositions } from "lib/use-fetch";

interface Props {

}

const Filters: React.FC<Props> = () => {
    const { t, i18n } = useTranslation({ ns: "portal" });
    const { data: positions } = useSpaPositions();
    const [config, setConfig] = useParamsState({
        page: 0,
        take: 10,
        search: "",
        type: [] as RequestType[],
        category: [] as Category[],
        position: [] as string[],
        startDate: null,
        endDate: null,
        showCompleted: false,
        reserveStart: null,
        reserveEnd: null,
    });

    const onShowCompletedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
        setConfig(({ showCompleted: e.target.checked })), [setConfig]);

    const onPeriodChange = useCallback((key1, key2) => (update) => {
        if (update[0] || (update[0] && update[1])) {
            setConfig(({
                [key1]: update[0] as never,
                [key2]: update[1] ? (update[1] as never) : null,
            }));
        } else {
            setConfig(({ [key1]: null, [key2]: null }));
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

            <MultiSelect<UseSpaPositions[0], string>
                name={t("service")}
                onChange={(newIds) => setConfig({ position: newIds })}
                selValue={config.position}
                transformValue={(id: string) => {
                    return positions?.find((position) => id === position.id)?.name?.[i18n.language] as string;
                }}
                options={positions ?? []}
                customOptions={(options) => {
                    return options.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                            {name?.[i18n.language]}
                        </MenuItem>
                    ));
                }}
            />

            <Box sx={{ width: "300px" }}>
                <DatePicker
                    customInput={<DateRangePickerInput />}
                    placeholderText={t("request_time")}
                    selectsRange={true}
                    startDate={config?.startDate}
                    endDate={config?.endDate}
                    onChange={onPeriodChange("startDate", "endDate")}
                    isClearable={true}
                />
            </Box>

            <Box sx={{ width: "300px" }}>
                <DatePicker
                    customInput={<DateRangePickerInput />}
                    placeholderText={t("booking_time")}
                    selectsRange={true}
                    startDate={config?.reserveStart}
                    endDate={config?.reserveEnd}
                    onChange={onPeriodChange("reserveStart", "reserveEnd")}
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
