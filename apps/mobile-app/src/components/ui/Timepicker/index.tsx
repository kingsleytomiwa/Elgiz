import React, { useState } from "react";
import { View, Button, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomText from "../../CustomText";
import { twMerge } from "tailwind-merge";
import MinuteInterval from "@react-native-community/datetimepicker";
import { useFormContext } from "react-hook-form";

interface Props {
	name: string;
  label: string;
  interval?: typeof MinuteInterval;
}

const Timepicker: React.FC<Props> = ({ name, label, interval }) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

	const { setValue } = useFormContext();

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setShowTime(true);
		setValue(name, currentDate);
  };

  const showTimePicker = () => {
    setShow(true);
  };

  return (
    <View>
      {Platform.OS === "ios" ? (
        <View className="">
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChange}
            // minuteInterval={interval ? interval : 1}

            style={{
              zIndex: 100,
            }}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={showTimePicker}
            className="bg-[#BAD7E9] py-2 rounded-[15px] w-[150px] flex items-center justify-center"
          >
            <CustomText className="text-[14px]">
              {showTime ? date.toLocaleTimeString() : label}
            </CustomText>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
        </>
      )}
    </View>
  );
};

export default Timepicker;
