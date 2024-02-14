"use client";

import { Box, Typography } from "@mui/material";
import RequestIcon from "../icons/RequestIcon";
import ChatIcon from "../icons/ChatIcon";
import Burger from "../RequestsContainer/burger";
import Link from "next/link";
import { format } from "date-fns";
import { useMessageThreads } from "lib/use-fetch";
import { useTranslation } from "i18n";

const ChatsContainer = ({ name }: { name: string }) => {
  const threads = useMessageThreads();
  const { t } = useTranslation({ ns: "mobile-portal" });

  console.log(threads.data);

  return (
    <Box
      sx={{
        px: "16px",
        width: "100%",
        py: "16px",
      }}
    >
      <Box sx={{ pb: "80px" }}>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Burger name={name} />
        </Box>
        <Typography
          sx={{
            mt: "13px",
            textAlign: "center",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          {t("chat")}
        </Typography>
        {threads.data?.data?.map((item) => (
          <Link
            href={`/chat/${item.guestId}`}
            key={item.guestId}
            style={{ textDecoration: "none", color: "#121828" }}
          >
            <Box
              sx={{
                borderBottom: "1px solid #868A91",
                py: 1,
                cursor: "pointer",
              }}
            >
              <Box
                alignItems="center"
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
              >
                <Box alignItems="center" display={"flex"} flexDirection={"row"}>
                  {!item.wasRead && item.senderId === item.guestId && (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#3F51B5",
                        marginRight: "8px",
                      }}
                    />
                  )}

                  <Typography typography={`subtitle1`}>
                    {(item as any)?.guest.name} - {(item as any)?.guest.room}
                  </Typography>
                </Box>

                <Typography typography={`subtitle2`}>
                  {format(new Date(item.createdAt!), "dd MMM, HH:mm")}
                </Typography>
              </Box>

              <Typography sx={{ mt: 1, color: "#868A91" }} variant="body1">
                {item.text.length > 44 ? `${item.text.slice(0, 44)}...` : item.text}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          background: "white",
          py: "23px",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Link href={"/"}>
          <RequestIcon fill="#B3B9C1" />
        </Link>
        <Link href={"/chat"}>
          <ChatIcon fill="#2B3467" />
        </Link>
      </Box>
    </Box>
  );
};

export default ChatsContainer;
