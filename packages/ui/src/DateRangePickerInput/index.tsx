import * as React from "react";
import { Today } from "@mui/icons-material";
import { Box } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const DateRangePickerInput = React.forwardRef((props: any, ref: any) => {
  return (
    <Box
      sx={{ display: "flex", cursor: "pointer", alignItems: "center", width: "100%", fontSize: "16px", lineHeight: "24px" }}
      onClick={props.onClick}
    >
      <Today sx={{ fill: "#3F51B5", mr: 1 }} />
      <label
				style={{ color: "#9EA5AD", cursor: "pointer" }}
        ref={ref}
      >
        {props.value || props.placeholder}
      </label>
    </Box>
  );
});

export default DateRangePickerInput;
