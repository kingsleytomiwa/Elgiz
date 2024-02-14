import { AdminNotificationType, NotificationType } from "@prisma/client";

export const useNotificationLabel = (
  type: AdminNotificationType | NotificationType,
  data: string[],
  language: string
) => {
  let labelMessage = "";
  switch (type) {
    case AdminNotificationType.PAYMENT:
      // TODO! A string should be used from translations.json here after implementation of localization
      labelMessage =
        "Отель совершил банковский перевод EUR $0 за оплату подписки.";
      break;
    // Add more cases for other notification types if needed
  }
  data.forEach((text, index) => {
    labelMessage = labelMessage.replace(`$${index}`, text);
  });
  return labelMessage;
};
