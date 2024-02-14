"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, OutlinedInput, Typography } from "@mui/material";
import { format } from "date-fns";
import { Send } from "@mui/icons-material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGuest, useMessageThreads, useMessages, useUnread } from "lib/use-fetch";
import { readMessages, sendMessage } from "./actions";

export default function Chat({ params }: { params: { guestId: string } }) {
  const [text, setText] = useState("");

  const { data: guest } = useGuest(params.guestId);
  const { data: messages, mutate } = useMessages(
    params.guestId,
    { take: 50, page: 0, skip: 0 },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 18000,
    }
  );
  const threads = useMessageThreads();
  const unread = useUnread();

  const invalidate = useCallback(async () => {
    await Promise.all([mutate(), threads.mutate(), unread.mutate()]);
  }, []);

  useEffect(() => {
    readMessages(params.guestId).then(invalidate).catch(console.error);
  }, [params.guestId, messages, invalidate]);

  const sortedMessages = useMemo(() => {
    const getMsFromDate = (date: Date) => new Date(date).getTime();
    return messages?.data?.sort(
      (a, b) => getMsFromDate(b.createdAt!) - getMsFromDate(a.createdAt!)
    );
  }, [messages]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={1}
      height={"100vh"}
      pt="38px"
      px="16px"
    >
      <Box>
        <Link
          href={"/chat"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "#343A40",
            width: "fit-content",
          }}
        >
          <ArrowBackIcon sx={{ color: "#343A40" }} />
          <Typography>Назад</Typography>
        </Link>
        <Box
          width="100%"
          mt="20px"
          sx={{
            backgroundColor: "#BAD7E9",
            opacity: 0.5,
            py: "16px",
            borderRadius: "20px",
            mb: "4px",
          }}
        >
          <Typography sx={{ textAlign: "center" }} typography={`subtitle1`}>
            {guest?.name} - {guest?.room}
          </Typography>
        </Box>
        <Box
          width="100%"
          gap={"20px"}
          display="flex"
          flexDirection="column-reverse"
          height={"calc(100vh - 270px)"}
          sx={{ overflowY: "scroll" }}
        >
          {sortedMessages?.map((message) => {
            const isMine = message.senderId !== message.guestId;

            return (
              <Box key={message.id} display="flex">
                <Box
                  key={message.id}
                  sx={{
                    width: "100%",
                    px: "24px",
                    pb: "8px",
                    pt: isMine ? "8px" : "24px",
                    backgroundColor: isMine ? "#2B3467" : "#DBEBED",
                    borderRadius: isMine ? "15px 50px" : "50px 15px",
                  }}
                  display="flex"
                  flexDirection="column"
                >
                  <Typography
                    variant="body1"
                    color={isMine ? "white" : "#2B3467"}
                    sx={{ wordWrap: "break-word" }}
                  >
                    {message.text}
                  </Typography>

                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ opacity: 0.5 }}
                    color={isMine ? "white" : "#2B3467"}
                  >
                    {isMine && message.wasRead && message.senderId !== message.guestId && (
                      <span
                        style={{
                          fontSize: 14,
                          marginRight: 8,
                        }}
                      >
                        Прочитано
                      </span>
                    )}
                    <Typography variant="body1">
                      {format(new Date(message.createdAt!), "dd MMM, HH:mm")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          if (!text.trim()) {
            return;
          }

          try {
            await sendMessage({ guestId: params.guestId, text: text.trim() });
            invalidate();
            setText("");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Box height={56} width="100%">
          <OutlinedInput
            sx={{ width: "100%" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите сообщение"
            endAdornment={
              <button style={{ all: "unset" }} type="submit">
                <Send sx={{ color: "#6B7280", mr: 1 }} />
              </button>
            }
          />
        </Box>
      </form>
    </Box>
  );
}
