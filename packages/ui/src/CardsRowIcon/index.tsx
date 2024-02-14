import { Box, SvgIconTypeMap, SxProps } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

export type CardsRowIconProps = {
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  containerStyles?: SxProps;
  iconStyles?: SxProps
}

export default function CardsRowIcon({ Icon, containerStyles, iconStyles }: CardsRowIconProps) {
  return (
    <Box sx={{ width: "56px", height: "56px", borderRadius: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#14B8A6", ...containerStyles }}>
      <Icon sx={{ fill: "white", ...iconStyles }} />
    </Box>
  )
}
