"use client";

import React, { useState, useEffect } from "react";
import { format, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Warning } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export default function Timer({ creationDate }: { creationDate: Date }) {
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [isTooLong, setIsTooLong] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedMinutes = differenceInMinutes(now, creationDate);
      const elapsedSeconds = differenceInSeconds(now, creationDate) % 60;

      if (elapsedMinutes >= 10) {
        setIsTooLong(true);
      }

      if (elapsedMinutes >= 60) {
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const remainingMinutes = elapsedMinutes % 60;
        setElapsedTime(
          `${String(elapsedHours).padStart(2, "0")}:${String(
            remainingMinutes
          ).padStart(2, "0")}:${String(elapsedSeconds).padStart(2, "0")}`
        );
      } else {
        setElapsedTime(
          `${String(elapsedMinutes).padStart(2, "0")}:${String(
            elapsedSeconds
          ).padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [creationDate]);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {isTooLong && <Warning sx={{ fontSize: "20px", fill: "#F23838" }} />}
      {
        <Typography
          sx={{ color: isTooLong ? "#EB5757" : "#121828", fontSize: "14px" }}
        >
          {elapsedTime}
        </Typography>
      }
    </Box>
  );
}
