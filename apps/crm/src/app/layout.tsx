import "./globals.css";
import { Box } from "@mui/material";
import { ownerAuthOptions } from "backend-utils";
import { getServerSession } from "next-auth";
import { cache } from "react";
import "simplebar-react/dist/simplebar.min.css";
import { menus } from "src/constants";
import Provider from "src/providers/Provider";
import { Drawer } from "ui";
import prisma from "db";
import { cookies } from "next/headers";
import RedirectToMobile from "components/RedirectToMobile";

export const metadata = {
  title: "Elgiz CRM",
};

export const getUserSession = cache(() => getServerSession(ownerAuthOptions));
export const getHotelSettings = cache(async (hotelId: string) => (await prisma.hotel.findFirst({
  where: { id: hotelId },
  select: { settings: true }
}))?.settings! as any);

export default async function RootLayout({
  children,
}: { children: React.ReactNode; }) {
  const session = await getUserSession();
  let lang = "en";

  const cookie = cookies().get('X-Language');

  if (cookie?.value) {
    lang = cookie.value;
  }

  if (session) {
    const settings = await getHotelSettings(session.user?.hotelId!);
    lang = settings?.language;
  }

  return (
    <html lang={lang}>
      <body style={{ backgroundColor: "#F9FAFC" }}>
        <Provider>
          {session ? (
            <Box>
              <Drawer isAdmin={false} menus={menus}>
                {children}
              </Drawer>
            </Box>
          ) : (
            children
          )}
        </Provider>

        <RedirectToMobile />
      </body>
    </html>
  );
}
