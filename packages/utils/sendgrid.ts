"use server";

import Sendgrid from "@sendgrid/client";
import { MAILER } from "./constants";

Sendgrid.setApiKey(process.env.SENDGRID_KEY!);

type ScheduledEmail = {
  from?: {
    email: string;
    name?: string;
  };
  to: string | string[];
  subject: string;
  contentType?: string;
  content: string;
};

export async function sendMail({
  from = MAILER.noReply,
  to,
  subject,
  contentType = "text/html",
  content,
}: ScheduledEmail) {
  const body = {
    personalizations: [
      {
        to: Array.isArray(to)
          ? to.map((email) => ({ email }))
          : [
              {
                email: to,
              },
            ],
        subject,
      },
    ],
    from,
    content: [
      {
        type: contentType,
        value:
          contentType === "text/html"
            ? `
          <style>
            html, * {
              font-family: verdana, sans-serif;
            }
          </style>
          ${content}
        `
            : content,
      },
    ],
  };

  try {
    await Sendgrid.request({
      url: `/v3/mail/send`,
      method: "POST",
      body,
    });
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
}
