import { ChevronRight } from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { PaginationResponse } from 'backend-utils';
import queryString from 'query-string';
import React from 'react';
import useSWR from 'swr';
import { useDebounce } from 'usehooks-ts';

interface Props {
	path: string;
	disabled?: boolean;
	label: string;
	transformOption?: (data: unknown) => Option;
	defOptions?: Array<unknown>;
	outerOnChange?: (event: any, newValue: Option | null) => void;
	formik: any;
	formikKey: string;
	filter?: Record<string, unknown>;
}


export type Option = {
	label: string;
	value: string;
};

export const useAutocomplete = <T extends unknown>(
	path: string,
	transformOptions?: (dataElement: T) => Option,
	config?: Record<string, unknown>
) => {
	const [value, setValue] = React.useState<Option | null>(null);
	const [inputValue, setInputValue] = React.useState("");
	const [options, setOptions] = React.useState<readonly Option[]>([]);
	const debouncedInputValue = useDebounce(inputValue, 400);
	const {
		data,
		isLoading: isAutocompleteLoading,
		isValidating,
	} = useSWR<PaginationResponse<T>>(
		path
			? `/api/${path}?${queryString.stringify(
				{ search: debouncedInputValue ?? "", take: 10, page: 0, ...config },
				{
					skipEmptyString: true,
					skipNull: true,
					arrayFormat: "comma",
				}
			)}`
			: null,
		async (path) => (await axios.get(path)).data,
		{
			revalidateOnFocus: false,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		}
	);

	const onChange = (event: any, newValue: Option | null) => {
		setOptions(newValue ? [newValue, ...options] : options);
		setValue(newValue);
	};

	const onInputChange = (event, newInputValue) => {
		if (value?.label === newInputValue) return;
		setInputValue(newInputValue);
	};

	React.useEffect(() => {
		if (data) {
			const options = data?.data?.map(transformOptions!);
			setOptions(options);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const isLoading = isAutocompleteLoading || isValidating;

	return {
		value,
		options,
		inputValue,
		onChange,
		onInputChange,
		isLoading,
	};
};

const FormikAutocomplete: React.FC<Props> = ({ path, label, filter, transformOption, outerOnChange, formik, defOptions, formikKey, disabled = false }) => {
	if (filter) {
		console.log(filter);
	}
	const {
		onChange,
		onInputChange,
		options,
		isLoading
	} = useAutocomplete(path, transformOption, filter);

	return (
		<Autocomplete
			disabled={disabled}
			fullWidth
			sx={{ minWidth: "270px" }}
			options={defOptions || options}
			getOptionLabel={(option) => option.label}
			noOptionsText="Ничего не нашлось"
			autoComplete
			includeInputInList
			loading={isLoading}
			value={formik.values[formikKey]}
			popupIcon={<ChevronRight sx={{ rotate: "90deg" }} />}
			renderInput={(params) => (
				<TextField
					{...params}
					name={formikKey}
					value={formik.values[formikKey]}
					error={Boolean(formik.touched[formikKey] && formik.errors[formikKey])}
					helperText={formik.touched[formikKey] && formik.errors[formikKey]}
					label={label}
				/>
			)}
			onChange={(e, newValue) => {
				onChange(e, newValue);
				formik.setFieldValue(formikKey, newValue);
				outerOnChange?.(e, newValue);
			}}
			onInputChange={onInputChange}
			renderOption={(props, option) => {
				return <li {...props}>{option.label}</li>;
			}}
		/>
	);
};

export default FormikAutocomplete;
