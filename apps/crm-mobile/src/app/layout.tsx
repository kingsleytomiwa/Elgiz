import type { Metadata } from "next";
import "./globals.css";
import "simplebar-react/dist/simplebar.min.css";
import Provider from "src/providers/Provider";
import { cache } from "react";
import { getServerSession } from "next-auth";
import { ownerAuthOptions } from "backend-utils";
import prisma from "db";
import { cookies } from "next/headers";

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
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();
  let lang = "en";

  const cookie = cookies().get('X-Language');
  if (cookie?.value) {
    lang = cookie.value;
  } else {
    if (session) {
      const settings = await getHotelSettings(session.user?.hotelId!)
      lang = settings?.language;
    }
  }

  return (
    <html lang={lang}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
