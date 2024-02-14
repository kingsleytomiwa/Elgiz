import React, { useMemo, useState } from "react";
import { Box, OutlinedInput, Typography } from "@mui/material";
import { useGuest, useMessages } from "lib/use-fetch";
import { format } from "date-fns";
import { Send } from "@mui/icons-material";
import { readMessages, sendMessage } from "./actions";
import { useTranslation } from "i18n";

interface Props {
  guestId: string;
}

const Chat: React.FC<Props> = ({ guestId }) => {
  const [text, setText] = useState("");
  const { t } = useTranslation({ ns: "portal" });
  const { data: messages, mutate } = useMessages(
    guestId,
    { take: 50, page: 0 },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 18000,
    }
  );
  const { data: guest } = useGuest(guestId);

  const sortedMessages = useMemo(() => {
    const getMsFromDate = (date: Date) => new Date(date).getTime();
    return messages?.data?.sort(
      (a, b) => getMsFromDate(b.createdAt!) - getMsFromDate(a.createdAt!)
    );
  }, [messages]);

  return (
    <Box display="flex" flexDirection="column" p={1} flex={1}>
      <Box
        height={54}
        width="100%"
        sx={{
          backgroundColor: "#DDE3EE",
          px: 1,
          py: 2,
        }}
      >
        <Typography typography={`subtitle1`}>
          {guest?.name} - {guest?.room}
        </Typography>
      </Box>

      <Box
        height={430}
        width="100%"
        gap={2}
        display="flex"
        flexDirection="column-reverse"
        py={1}
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            background: "white",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#bfbfbf",
            borderRadius: "10px",
          },
        }}
      >
        {sortedMessages?.map((message) => {
          const isMine = message.senderId !== message.guestId;

          return (
            <Box
              key={message.id}
              display="flex"
              justifyContent={isMine ? "end" : "start"}
              sx={{ wordWrap: "break-word" }}
            >
              <Box
                justifyContent={isMine ? "end" : "start"}
                key={message.id}
                sx={{
                  width: "52%",
                  px: 2,
                  py: 1,
                  backgroundColor: isMine ? "#3F51B5" : "white",
                  borderRadius: 2.6,
                }}
                display="flex"
                flexDirection="column"
              >
                <Typography variant="body1" color={isMine ? "white" : "#121828"} maxWidth={"640px"}>
                  {message.text}
                </Typography>

                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  {isMine && message.wasRead && message.senderId !== message.guestId && (
                    <span style={{ fontSize: 14, marginRight: 8, color: "#ccc" }}>Прочитано</span>
                  )}
                  <Typography variant="body1" color={"#ccc"}>
                    {format(new Date(message.createdAt!), "HH:mm")}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await sendMessage({ guest: guest!, text: text.trim() });
            mutate();
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
            onFocus={() => readMessages(guestId)}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("enter_your_message")}
            endAdornment={
              <button
                style={{ padding: 0, margin: 0, border: "none", cursor: "pointer" }}
                type="submit"
              >
                <Send sx={{ color: "#6B7280", mr: 1 }} />
              </button>
            }
          />
        </Box>
      </form>
    </Box>
  );
};

export default Chat;
