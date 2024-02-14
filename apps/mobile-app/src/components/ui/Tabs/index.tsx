import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import CustomText from "../../CustomText";
import { twMerge } from "tailwind-merge";
import { i18n } from "../../../../App";

type Props = {
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
	tabs: { id: string, label: string }[];
  withTranslation?: boolean;
};

const Tabs: React.FC<Props> = ({ view, setView, tabs, withTranslation = false }) => {
  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      className="flex flex-row pl-4"
    >
      {tabs.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => setView(item.id)}
          className={twMerge(
            "py-1 px-4 rounded-[5px] mr-4",
            view === item.id && "bg-blue-400"
          )}
        >
          <CustomText
            className={twMerge(
              "text-blue-400 text-[14px]",
							view === item.id && "text-gray-100"
            )}
          >
            {withTranslation ? i18n?.t(item.label) : item.label}
          </CustomText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Tabs;
