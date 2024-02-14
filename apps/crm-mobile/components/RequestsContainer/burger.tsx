"use client";

import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslation } from "i18n";

const Burger: React.FC<{ name: string }> = ({ name }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation({ ns: "mobile-portal" });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={open ? "burgerButton active" : "burgerButton"}
      >
        <span />
      </button>

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          background: "#3F51B5",
          zIndex: 99,
          opacity: open ? 100 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: ".3s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          color: "white",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ color: "#FDFFF1", fontSize: "20px" }}>{name}</Typography>
        <Button
          onClick={handleLogout}
          sx={{
            color: "white",
            fontSize: "20px",
            fontWeight: "700",
            mt: "25px",
          }}
        >
          {t("go_out")}
        </Button>
      </Box>
    </>
  );
};

export default Burger;
