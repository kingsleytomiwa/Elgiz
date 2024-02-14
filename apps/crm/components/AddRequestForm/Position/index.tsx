import { Add, Edit, Remove } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import pastaImage from "../../../public/assets/menu/pasta.png";

export type SinglePosition = {
  imageURL: string;
  name: string;
  description: string;
  caption?: string;
  price: number;
};

export type PositionProps = {
  position: SinglePosition;
  onAdd?: () => void;
  onEdit?: () => void;
  onSubtract?: () => void;
  count?: number;
  isDisabled?: boolean;
};

export default function Position({
  position,
  count,
  onAdd,
  onEdit,
  onSubtract,
  isDisabled = false
}: PositionProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: 650,
        p: 2,
        pt: 4,
        borderBottom: "1px solid #B3B9C1",
        justifyContent: "space-between",
        opacity: isDisabled ? 0.5 : 1
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Image
            src={position?.imageURL || pastaImage}
            alt="meal image"
            width={83}
            height={88}
            style={{ borderRadius: "10px" }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          {position.caption && <Typography sx={{ fontSize: "13px", color: "#151515", opacity: 0.25 }}>
            {position.caption}
          </Typography>}
          <Typography sx={{ fontSize: "18px", color: "#151515", fontWeight: 700 }}>
            {position.name}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#151515", fontWeight: 300 }}>
            {position.description}
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "#151515" }}>
            EUR {position.price.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifySelf: "end" }}>
        {count && count > 0 && onSubtract ? (
          <>
            <Button
              onClick={onSubtract}
              disabled={isDisabled}
              sx={{
                border: "1px solid #1A1A1A",
                p: 1,
                minWidth: "unset",
                width: "32px",
                height: "32px",
                borderRadius: "5px",
              }}
            >
              <Remove sx={{ fontSize: "16px", color: "#1A1A1A" }} />
            </Button>

            <Typography sx={{ color: "#000", fontSize: "14px" }}>{count}</Typography>
          </>
        ) : <></>}

        {onEdit && (
          <Button
            onClick={onEdit}
            disabled={isDisabled}
            sx={{
              p: 1,
              minWidth: "unset",
              width: "32px",
              height: "32px",
            }}
          >
            <Edit sx={{ fontSize: "24px", color: "#3F51B5" }} />
          </Button>
        )}

        {onAdd && (
          <Button
            onClick={onAdd}
            disabled={isDisabled}
            sx={{
              border: "1px solid #1A1A1A",
              p: 1,
              minWidth: "unset",
              width: "32px",
              height: "32px",
              borderRadius: "5px",
            }}
          >
            <Add sx={{ fontSize: "16px", color: "#1A1A1A" }} />
          </Button>
        )}
      </Box>
    </Box>
  );
}
