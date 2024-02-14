import { Box, Typography, SxProps } from "@mui/material";
import { useTranslation } from "i18n";

export type DetailProps = { title: string; description: React.ReactNode | number | string; containerSx?: SxProps };

const Detail = ({ title, description, containerSx }: DetailProps) => {
  const { t } = useTranslation({ ns: "portal" });
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, ...containerSx }}>
			{title ? (
				<Typography sx={{
        	color: "#374151",
        	fontSize: "12px",
        	lineHeight: 1,
        	fontWeight: 600,
        	letterSpacing: "0.5px",
        	textTransform: "uppercase",
        	opacity: 0.5
      	}}>
        	{t(title)}
				</Typography>
			) : <></>}

      {(typeof description === "string" || typeof description === "number")
        ? (
          <Typography sx={{
            color: "#121828",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "21.98px"
          }}>
            {description}
          </Typography>
        )
        : description
      }
    </Box>
  )
}

export default Detail;
