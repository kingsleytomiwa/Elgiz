"use client";

import * as React from 'react';
import { OutlinedInput, Paper, Typography, Toolbar, MenuItem } from "@mui/material";
import { MultiSelect } from "ui";
import { Category, Hotel, Position, User } from "@prisma/client";
import { Search } from "@mui/icons-material";
import { CategoryLabel } from "utils";
import { useDebounce } from "usehooks-ts";
import { useHotelStaff } from "lib/use-fetch";
import EntityTable from 'components/EntityTable';
import AddStaffForm from "../AddStaffForm";
import { sectionOptions } from 'src/utils/constants';
import { useTranslation } from 'i18n';

const Table = ({ hotel }: { hotel: Hotel }) => {
  const { t } = useTranslation({ ns: "portal" });
	const [worker, setWorker] = React.useState<User>();
  const [config, setConfig] = React.useState({
    page: 0,
    take: 10,
    search: '',
		sections: [] as Category[],
		positions: [Position.OWNER, Position.STAFF]
  });

  const debouncedConfig = useDebounce({ ...config }, 700);
  const { data, isLoading, mutate } = useHotelStaff(debouncedConfig);

  const onSearch = (e) => config.search !== e.target.value && setConfig(prevState => ({ ...prevState, search: e.target.value }));

  return (
    <>
      <Toolbar />

      <Typography variant="h4">
        {t("hotel_staff")}
      </Typography>

      <Paper sx={{ mt: 10, px: 3, py: 4, gap: 2, display: "flex", alignItems: "center" }}>
        <OutlinedInput
          onChange={onSearch}
          placeholder="Поиск запроса"
          startAdornment={<Search sx={{ color: "#6B7280", mr: 1 }} />}
        />

				<MultiSelect
					name={t("chapter")}
					options={sectionOptions}
					onChange={(sections: Category[]) => setConfig(prev => ({ ...prev, sections }))}
					selValue={config.sections}
					transformValue={(selected) => CategoryLabel[selected]}
					customOptions={(options) => {
						return options.map(option => (
							<MenuItem
								key={option}
								value={option}
							>
								{t(CategoryLabel[option])}
							</MenuItem>
						))
					}}
				/>
      </Paper>

      <AddStaffForm
        hotel={hotel}
				onSuccess={mutate}
				onClose={() => setWorker(undefined)}
				worker={worker}
      />

      <EntityTable
        data={data?.data || []}
        isLoading={isLoading}
        columns={[
          { key: 'name', label: t("full_name"), minWidth: 200 },
          { key: 'email', label: t("el_mail"), minWidth: 200 },
          { key: 'sections', label: t("chapter"), minWidth: 200, format: (value: Category[]) => value.map(category => t(CategoryLabel[category])).join(", ") },
        ]}
        total={data?.total}
        take={config.take}
        page={config.page}
        onPageChange={(event: unknown, newPage: number) => {
          setConfig(prevState => ({ ...prevState, page: newPage }));
        }}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setConfig(prevState => ({ ...prevState, page: 0, take: +event.target.value }));
				}}
				onSelect={(row) => {
					setWorker(row);
				}}
      />
    </>
  );
};

export default Table;
