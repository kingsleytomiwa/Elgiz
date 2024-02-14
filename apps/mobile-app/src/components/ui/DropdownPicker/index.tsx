import { useState } from "react";
import DropDownPicker, { DropDownPickerProps, ValueType } from "react-native-dropdown-picker";

const DropdownPicker = <T extends ValueType>({
	min = 0,
	max = 6,
	...props
}: Omit<DropDownPickerProps<T>, "open" | "setOpen"> & { open?: DropDownPickerProps<T>["open"]; setOpen?: DropDownPickerProps<T>["setOpen"]}) => {
	const [open, setOpen] = useState(false);
	
	return (
		// @ts-ignore
		<DropDownPicker
			showTickIcon
			open={!!open}
			setOpen={setOpen}
			textStyle={{ color: "black" }}
			style={{ width: 150, backgroundColor: "#BAD7E9", borderColor: "transparent", borderRadius: 15 }}
			{...props}
		/>
	)
}

export default DropdownPicker;