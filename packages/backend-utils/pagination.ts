import { NextApiRequestQuery } from "next/dist/server/api-utils";

export type PaginationRequest<T = {}> = {
  take: number;
  page: number;
  skip: number;
  search?: string;
  sort?: string;
} & {
  [key in keyof T]?: T[key] | string;
};

export type PaginationResponse<T = {}> = {
  data: T[];
  page: number;
  take: number;
  total: number;
};

export function parseQuery<T extends Record<string, unknown>>(
  query: NextApiRequestQuery &
    T & { page?: any; take?: any; search?: any; skip?: any }
) {
  Object.keys(query).forEach((key) => {
    if (query[key] === "") {
      delete query[key];
    }
  });

  query.page = query?.page ? parseInt(query.page as string) : 0;
  query.take = query?.take ? parseInt(query.take as string) : 10;
  query.skip = query.take * query.page;

  if (query.search) {
    query.search = (query?.search as string)?.trim();
  }

  return query;
}
