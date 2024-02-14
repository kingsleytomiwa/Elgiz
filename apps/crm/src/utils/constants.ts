import { Category, Prisma, RequestStatus } from "@prisma/client";

export const sectionOptions = Object.values(Category).map((section) => Category[section]);

export type InputLanguage = {
  [language: string]: { [field: string]: unknown }[];
};

export type OutputLanguage = Prisma.InputJsonValue & {
  [field: string]: { [language: string]: unknown };
};

export function transformData(inputData: InputLanguage): OutputLanguage {
  const outputData: OutputLanguage = {};

  for (const language in inputData) {
    for (const entry of inputData[language]) {
      for (const field in entry) {
        outputData[field] = outputData[field] || {};
        outputData[field][language] = entry[field];
      }
    }
  }

  return outputData;
}
