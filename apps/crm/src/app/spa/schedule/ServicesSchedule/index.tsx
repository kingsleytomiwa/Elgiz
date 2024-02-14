"use client";

import {
  MenuItem,
  Paper,
} from "@mui/material";
import { getHHMMFromDate } from "utils";
import Schedule from "../Schedule";
import React, { useMemo, useState } from "react";
import { Category, ParameterType, Position, User } from "@prisma/client";
import { useDebounce } from "usehooks-ts";
import {
  UseSpaPositions,
  useHotelStaff,
  useRequests,
  useSpaPositions,
  useParameters,
} from "lib/use-fetch";
import { MultiSelect } from "ui";
import { useTranslation } from "i18n";
import i18next from "i18next";
import { useHandleParams } from "src/hooks";

const ServicesSchedule = () => {
  const handleParams = useHandleParams();
  const { t } = useTranslation({ ns: "portal" });
  const [config, setConfig] = useState({
    page: 0,
    take: 10,
    search: "",
    requestType: "",
    positionId: [] as string[],
    workerId: [] as string[],
    showCompleted: false,
    category: Category.SPA,
    noWorkers: false,
  });

  const debouncedConfig = useDebounce(config, 700);
  const {
    data: requests,
  } = useRequests({ ...debouncedConfig, type: debouncedConfig.requestType }, { revalidateOnMount: true });
  const {
    data: positions,
  } = useSpaPositions();
  const { data: staff } = useHotelStaff({
    sections: [Category.SPA],
    positions: [Position.STAFF],
    take: 10,
    page: 0,
  });
  const { data: settings } = useParameters(ParameterType.SPA);

  const parameter = useMemo(() => {
    return settings?.find(setting => setting.type === ParameterType.SPA);
  }, [settings]);

  return (
    <>
      {/* FILTERS */}
      <Paper
        sx={{
          my: 3,
          px: 3,
          py: 4,
          gap: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <MultiSelect<UseSpaPositions[0], string>
          name={t("service")}
          onChange={(newIds) => setConfig((prev) => ({ ...prev, positionId: newIds }))}
          selValue={config.positionId}
          transformValue={(id: string) => {
            return positions?.find((position) => id === position.id)?.name?.[i18next.language] as string;
          }}
          options={positions ?? []}
          customOptions={(options) => {
            return options.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name?.[i18next.language]}
              </MenuItem>
            ));
          }}
        />

        <MultiSelect<User, string>
          name={t("master")}
          onChange={(newIds) => setConfig((prev) => ({ ...prev, workerId: newIds }))}
          selValue={config.workerId}
          transformValue={(id: string) => {
            return staff?.data?.find((worker) => id === worker.id)?.name as string;
          }}
          options={staff?.data ?? []}
          customOptions={(options) => {
            return options.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ));
          }}
        />
      </Paper>

      {parameter?.spaOpeningTime && parameter?.spaClosingTime && (
        <Schedule
          onEventClick={(id) => handleParams([['selected', id]])}
          start={getHHMMFromDate(new Date(parameter.spaOpeningTime))}
          end={getHHMMFromDate(new Date(parameter.spaClosingTime))}
          events={requests?.data.map((req) => ({
            // @ts-ignore
            title: req?.data?.products?.[0]?.name?.[i18next.language],
            id: req.id as any,
            start: new Date(req.reserveStart!),
            end: new Date(req.reserveEnd!),
            color: req?.worker?.color,
          }))}
        />
      )}
    </>
  );
};

export default ServicesSchedule;
