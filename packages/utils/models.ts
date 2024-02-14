import { Request, StatusChange } from "@prisma/client";

export type RequestWithHistory = Request & {
  history: (StatusChange & { staff: { name: string } })[];
  staffId: string;
};
