import { Box, Stack, Typography } from "@mui/material";
import CardsRowIcon, { CardsRowIconProps } from "../CardsRowIcon";

export type CardsRowProps = {
  cards:
  ({
    title: string;
    value: number;
    hint?: string
  } & CardsRowIconProps)[]
}

export default function CardsRow({ cards }: CardsRowProps) {
  return (
    <Stack
      spacing={3}
      direction="row"
      sx={{ mt: 3 }}
    >
      {cards.map(card => (
        <Box
          key={card.title}
          sx={{
            px: 3,
            pb: 1,
            pt: 4,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            maxWidth: "350px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)"
          }}
        >
          <Stack spacing={2}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, lineHeight: "30px", color: "#65748B", textTransform: "uppercase" }}>
              {card.title}
            </Typography>
            <Typography sx={{ fontSize: "32px", fontWeight: 700, lineHeight: "44px", color: "#121828" }}>
              {card.value}
            </Typography>
            <Typography sx={{ fontSize: "14px", lineHeight: "22px", color: "#121828", opacity: 0.5 }}>
              {card.hint}
            </Typography>
          </Stack>

          <CardsRowIcon {...card} />
        </Box>
      ))}
    </Stack>
  )
}
