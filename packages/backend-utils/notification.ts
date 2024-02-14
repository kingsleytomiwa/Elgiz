"use server";

import { Expo } from "expo-server-sdk";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendPushNotification(
  token: string,
  message: {
    title: string;
    body: string;
  },
  data?: any
) {
  return await expo.sendPushNotificationsAsync([
    {
      ...message,
      to: token,
      data,
    },
  ]);
}
