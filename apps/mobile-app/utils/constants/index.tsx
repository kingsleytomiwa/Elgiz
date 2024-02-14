import { Dimensions, Platform } from "react-native";

// <CONSTANTS>
export const deviceWidth = Dimensions.get("window").width;
export const deviceHeight = Dimensions.get("window").height;

export const shadowStyles = {
  shadowColor: Platform.OS === "android" ? "#000000" : "#D3D3D3",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.5,
  shadowRadius: 2,
  elevation: 2,
};
// </CONSTANTS>
