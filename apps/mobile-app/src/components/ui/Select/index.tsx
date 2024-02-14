import { View } from "react-native";
import { Picker, PickerItemProps } from "@react-native-picker/picker";
import { twMerge } from "tailwind-merge";
import CustomText from "../../CustomText";

type SelectProps<T> = {
  className?: string;
  error?: string;
  label?: string;
  options: Array<PickerItemProps<T>>;
  selectedValue: T;
  onChange?: (itemValue: T, itemIndex: number) => void;
};

const Select = <T extends string>({
  className,
  options,
  selectedValue,
  error,
  label,
  onChange,
}: SelectProps<T>) => {
  return (
    <>
      {label && (
        <CustomText variant="bold" className="text-[14px] mb-1">
          {label}
        </CustomText>
      )}
      <View className={twMerge(className)}>
        <Picker selectedValue={selectedValue} onValueChange={onChange}>
          {options.map((item) => (
            <Picker.Item {...item} key={item.value} />
          ))}
        </Picker>
      </View>
      {error && <CustomText className="text-red-600 my-2">{error}</CustomText>}
    </>
  );
};

export default Select;
