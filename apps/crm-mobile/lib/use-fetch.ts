import useSWR, { SWRConfiguration } from "swr";
import axios from "axios";
import { Message } from "@prisma/client";
import queryString from "query-string";
import { PaginationRequest, PaginationResponse } from "backend-utils";

export function useMessages(
  guestId: string | undefined,
  config: PaginationRequest,
  options: SWRConfiguration = {}
) {
  return useSWR<PaginationResponse<Message & { guest: { name: string; room: string } }>>(
    guestId
      ? `/api/messages/${guestId}?${queryString.stringify(config, {
          skipEmptyString: true,
          skipNull: true,
          arrayFormat: "comma",
        })}`
      : null,
    async (path) => (await axios.get(path)).data,
    options
  );
}

export function useGuest(guestId: string) {
  return useSWR<{ id: string; name: string; room: string }>(
    `/api/guest/${guestId}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useMessageThreads(
  config: PaginationRequest = {
    page: 0,
    take: 35,
    skip: 0,
  }
) {
  return useSWR<PaginationResponse<Message & { guest: { name: string; room: string } }>>(
    `/api/messages?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      refreshInterval: 18000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useUnread() {
  return useSWR<{ id: string } | null>(
    `/api/messages/unread`,
    async (path) => (await axios.get(path)).data,
    {
      refreshInterval: 18000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}
