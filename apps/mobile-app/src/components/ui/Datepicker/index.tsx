import React, { useState } from "react";
import { Platform, View, TouchableOpacity } from "react-native";
import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
  DatePickerOptions,
} from "@react-native-community/datetimepicker";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import CustomText from "../../CustomText";

type DatepickerProps = {
  date: Date | null;
  name: string;
  label?: string;
  className?: string;
  error?: string;
	options?: DatePickerOptions;
	disabled?: boolean;
};

const Datepicker: React.FC<DatepickerProps> = ({
  date,
  name,
  label,
  error,
  className,
	options,
	disabled = false
}) => {
  const [show, setShow] = React.useState(false);

  const { control, setValue } = useFormContext();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setShow(false);

    if (date !== currentDate) {
      setValue(name, currentDate);
    }
	};

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={() => (
        <>
          {Platform.OS === "android" ? (
            <TouchableOpacity
              onPress={!disabled ? () => setShow((p) => !p) : () => {}}
							activeOpacity={1}
              className={twMerge(
                "bg-[#BAD7E9] py-2 rounded-[15px] w-[150px] flex items-center justify-center",
                error && "border-red-600",
                className
              )}
            >
              <CustomText className="text-[14px] text-blue-400">
                {date ? new Date(date).toLocaleDateString() : label}
              </CustomText>

              {show && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode={"date"}
                  onChange={onDateChange}
                  {...options}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View className="flex justify-start w-[120px] ml-[-14px]">
              <DateTimePicker
								value={date ?? new Date()}
								disabled={disabled}
                mode={"date"}
                onChange={onDateChange}
                display="compact"
                style={{ zIndex: 100 }}
                accentColor="#2B4E8C"
                {...options}
              />
            </View>
          )}
        </>
      )}
    />
  );
};

export default Datepicker;
