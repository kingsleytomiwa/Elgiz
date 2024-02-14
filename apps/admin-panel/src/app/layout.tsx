import { Box } from "@mui/material";
import { adminAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { cache } from "react";
import "simplebar-react/dist/simplebar.min.css";
import { menuLinks } from "src/constants";
import Provider from "src/providers/Provider";
import { Drawer } from "ui";

export const metadata = {
  title: "Homepage",
};

export const getUserSession = cache(() => getServerSession(adminAuthOptions));

export default async function RootLayout({ children }: { children: React.ReactNode; }) {
  const session = await getUserSession();

  return (
    <html lang="ru">
      <body style={{ backgroundColor: "#F9FAFC" }}>
        <Provider>
          {session ? (
            <Box>
              <Drawer
                isAdmin
                menus={[menuLinks]}
              >
                {children}
              </Drawer>
            </Box>
          ) : (
            children
          )}
        </Provider>
      </body>
    </html>
  );
}
