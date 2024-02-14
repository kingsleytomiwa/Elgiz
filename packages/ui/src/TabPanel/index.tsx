import { Box, SxProps } from "@mui/material";

export interface TabPanelProps<T> {
  children?: React.ReactNode;
  index: T;
  activeIndex: T;
  sx?: SxProps;
}

export function TabPanel<T extends unknown>(props: TabPanelProps<T>) {
  const { children, activeIndex, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={activeIndex !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {activeIndex === index && (
        <Box sx={{ px: 3, pt: 3, ...sx }}>{children}</Box>
      )}
    </div>
  );
}

export function a11yProps(index: number | string) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
