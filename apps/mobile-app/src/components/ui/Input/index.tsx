import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import CustomText from "../../CustomText";

export type InputProps<T extends FieldValues> = Partial<TextInputProps> & {
  name: Path<T>;
  control: Control<T>;
  error?: string;
  parentClassName?: string;
};

// TODO! Move out to utils

const Input = <T extends FieldValues>({
  name,
  control,
  error,
  className,
  parentClassName,
  ...textInputProps
}: InputProps<T>) => (
  <Controller
    name={name}
    control={control}
    rules={{
      required: true,
    }}
    render={({ field: { onChange, onBlur, value } }) => (
      <>
        <TextInput
          style={{ fontFamily: "GolosRegular" }}
          className={twMerge(
            "p-4 bg-blue-300 rounded-lg w-full text-[18px]",
            error && "border-red-600  text-red-600",
            className
          )}
          placeholderTextColor="rgba(52, 58, 64, 0.5)"
          onBlur={onBlur}
          // TODO:
          // @ts-ignore
          onChangeText={onChange}
          value={value}
          {...textInputProps}
        />
        {error && (
          <CustomText className="text-red-600 my-2">{error}</CustomText>
        )}
      </>
    )}
  />
);

export default Input;
