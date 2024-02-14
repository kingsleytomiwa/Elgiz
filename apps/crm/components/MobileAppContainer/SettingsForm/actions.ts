"use server";

import prisma from "db";
import { ownerAuthOptions, saveBlob } from "backend-utils";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type Settings = {
  language?: string;
  timezone?: string;
  currency?: string;
  splash?: {
    screen?: boolean;
    image?: string;
    slogan?: string;
  };
  restaurantMenu?: {
    specificServeTimeAllowed?: boolean;
  };
};
export const onMutateSettings = async (settings: Partial<Settings>, formData?: FormData) => {
  const session = await getServerSession(ownerAuthOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const hotel = await prisma.hotel.findUnique({
    where: {
      id: session.user.hotelId!,
    },
  });

  if (settings?.splash && !settings.splash?.image && formData) {
    // uploading to vercel blob
    settings.splash.image = await saveBlob(formData);
  }

  const newSettings = settings as any;
  const oldSettings = hotel?.settings as any;

  if (newSettings.language) {
    cookies().set("X-Language", newSettings.language);
  }

  // uploading to prisma
  await prisma.hotel.update({
    where: {
      id: session.user.hotelId!,
    },
    data: {
      settings: {
        language: newSettings.language ?? oldSettings?.language,
        timezone: newSettings.timezone ?? oldSettings?.timezone,
        currency: newSettings.currency ?? oldSettings?.currency,
        splash: {
          screen: getValueOrDefault(newSettings.splash?.screen, oldSettings?.splash?.screen, false),
          image: getValueOrDefault(newSettings.splash?.image, oldSettings?.splash?.image, ""),
          slogan: getValueOrDefault(newSettings.splash?.slogan, oldSettings?.splash?.slogan, ""),
        },
        restaurantMenu: {
          specificServeTimeAllowed: getValueOrDefault(
            newSettings?.restaurantMenu?.specificServeTimeAllowed,
            oldSettings?.restaurantMenu?.specificServeTimeAllowed,
            false
          ),
        },
      },
    },
  });

  revalidatePath("/", "layout");
};

// Function to handle undefined values
const getValueOrDefault = (newValue: any, oldValue: any, defaultValue: any) => {
  return newValue !== undefined ? newValue : oldValue ?? defaultValue;
};
