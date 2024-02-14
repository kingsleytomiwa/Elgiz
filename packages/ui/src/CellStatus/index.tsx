import { Box, Typography } from "@mui/material";

const CellStatus = ({ text }: { text: string }) => (
  <Box sx={{ backgroundColor: "#3F51B5", px: 1, py: 0.25, borderRadius: "12px", textAlign: "center" }}>
    <Typography sx={{ fontWeight: 600, fontSize: "12px", lineHeight: "24px", letterSpacing: "0.5px", textTransform: "uppercase", color: "white" }}>
      {text}
    </Typography>
  </Box>
)

export default CellStatus;
