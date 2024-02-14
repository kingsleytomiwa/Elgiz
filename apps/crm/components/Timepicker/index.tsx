import React from "react";
import { Today } from "@mui/icons-material";
import { DesktopTimePicker, DesktopDateTimePickerProps, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";

const sharedTimePickerProps = (value: unknown) => ({
	ampm: false,
	slotProps: {
		textField: {
			sx: {
				width: "250px",
				"& .MuiInputBase-root": {
					display: "flex",
					flexDirection: "row-reverse",
					color: value ? "#121828" : "#9EA5AD",
					// borderColor: "#00000080",
					"& .MuiInputBase-input.MuiFilledInput-input": {
						fontWeight: 400
					}
				},
				"& input": { fontSize: "16px", p: 2 }
			}
		}
	},
	slots: {
		openPickerIcon: () => <Today sx={{ fill: "#3F51B5" }} />,
	}
})

type TimePickerProps = DesktopDateTimePickerProps<unknown> & {
	placeholder?: string;
};

const TimePicker = ({ onChange, value, disabled, placeholder }: TimePickerProps) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DesktopTimePicker
				{...sharedTimePickerProps(value)}
				disabled={disabled}
				slotProps={{
					textField: {
						...sharedTimePickerProps(value).slotProps.textField,
						placeholder
					}
				}}
				onChange={onChange}
				value={value}
			/>
		</LocalizationProvider>
	);
}

export default TimePicker;