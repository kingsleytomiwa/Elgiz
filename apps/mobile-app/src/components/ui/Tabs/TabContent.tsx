import React, { useState } from "react";
import { View, Text } from "react-native";

type Props = React.PropsWithChildren & {
  id: string;
  activeTabId: string;
};

const TabContent: React.FC<Props> = ({ children, id, activeTabId }) => {
  return <>{id === activeTabId && <View className="h-full">{children}</View>}</>;
};

export default TabContent;
