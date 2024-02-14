import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

export type SPAItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isChecked?: boolean;
};

export type SPACardProps = {
  item: SPAItem;
  onCheck: () => void;
  count?: number;
};

export default function SPACard({
  item: { name, description, image, price, id, isChecked = false },
  onCheck,
}: SPACardProps) {

  return (
    <Button onClick={onCheck}
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: 650,
        p: 2,
        pt: 4,
        borderBottom: "1px solid #B3B9C1",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

        {image && <Box>
          <Image
            src={image}
            alt="spa card"
            width={83}
            height={88}
            style={{ borderRadius: "10px" }}
          />
        </Box>}

        <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column", gap: 0.75 }}>
          <Typography sx={{ fontSize: "20px", color: "#2B3467", fontWeight: 700, letterSpacing: "0.2px" }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: "18px", color: "#2B3467", fontWeight: 400, opacity: 0.5 }}>
            {description}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#2B3467" }}>
            EUR {price.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifySelf: "end" }}>
        <Box
          sx={{
            border: "1px solid #1A1A1A",
            p: 1,
            minWidth: "unset",
            width: "16px",
            height: "16px",
            borderRadius: "100%",
            position: "relative",
            backgroundColor: isChecked ? "#2B3467" : "white",
            boxShadow: isChecked ? "0px 1px 1px 0px rgba(0, 0, 0, 0.12), 0px 0px 0px 1px rgba(103, 110, 118, 0.16), 0px 2px 5px 0px rgba(103, 110, 118, 0.08)" : "",
            "&:before": {
              content: "''",
              position: "absolute",
              top: 5,
              left: 5,
              width: "6px",
              height: "6px",
              borderRadius: "100%",
              backgroundColor: "white"
            }
          }}
        />
      </Box>
    </Button>
  );
}
