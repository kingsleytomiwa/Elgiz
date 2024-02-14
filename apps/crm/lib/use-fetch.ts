import useSWR, { SWRConfiguration } from "swr";
import {
  PaginationRequest as BackendPaginationRequest,
  PaginationResponse,
} from "backend-utils/pagination";
import axios from "axios";
import queryString from "query-string";
import { CategoryLabel, TimeslotWithLabel } from "utils";
import { GuestRequest, TableGuest } from "db";
import {
  Guest,
  Message,
  User,
  FoodCategory,
  FoodPosition,
  SpaPosition,
  ShopCategory,
  ShopPosition,
  Category,
  Position,
  Module,
  SubModule,
  Hotel,
  Notification,
  UserNotification,
  Review,
  Parameter,
  ParameterType,
} from "@prisma/client";
import { RequestWithHistory } from "utils/models";
import { ReviewWithGuest } from "src/app/reception/reviews/ReviewRequestDetails";
import { Settings } from "components/MobileAppContainer/SettingsForm/actions";

type PaginationRequest = Omit<BackendPaginationRequest, "skip">;

export function useHotelStaff(
  config: PaginationRequest & { sections: Category[]; positions: Position[] }
) {
  return useSWR<PaginationResponse<User>>(
    `api/staff?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useSettings() {
  return useSWR<Settings>("/api/settings", async (path) => (await axios.get(path)).data, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}

export function useHotel() {
  return useSWR<Hotel>("/api/hotel", async (path) => (await axios.get(path)).data, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    refreshInterval: 300000,
  });
}

export function useNotifications() {
  return useSWR<{ notifications: Notification[]; count: number }>(
    "/api/notifications",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 300000,
    }
  );
}

export type Modules = (Module & { subModules: SubModule[] })[];

export function useModules() {
  return useSWR<Modules>(`/api/modules`, async (path) => (await axios.get(path)).data, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}

export type SpaSettings = {
  startTime: string;
  endTime: string;
};
export function useSpaSettings() {
  return useSWR<SpaSettings>("/api/spa/settings", async (path) => (await axios.get(path)).data, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}

export function useParameters(type?: ParameterType) {
  return useSWR<Parameter[]>(
    `/api/parameters?${queryString.stringify({ type }, { skipEmptyString: true, skipNull: true })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useSpaTimeSlots(positionId?: string, date?: Date) {
  return useSWR<TimeslotWithLabel[]>(
    date ? `/api/spa-slots?${queryString.stringify({ positionId, date })}` : null,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useSpaTherapists(positionId?: string, start?: Date, end?: Date) {
  return useSWR<{ id: string; name: string }[]>(
    start && end && positionId
      ? `/api/spa-therapists?${queryString.stringify({ positionId, start, end })}`
      : null,
    async (path) => (await axios.get(path)).data
  );
}

export function useRequests<T extends Record<string, unknown>>(
  config: T,
  swrConfig: SWRConfiguration = {}
) {
  return useSWR<
    PaginationResponse<
      RequestWithHistory & {
        worker: { name: string; color: string };
        guest: { name: string; room: string };
      }
    >
  >(
    `/api/requests?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
      ...swrConfig,
    }
  );
}

export function useReviews<T extends Record<string, unknown>>(config: T) {
  return useSWR<PaginationResponse<ReviewWithGuest>>(
    `/api/reviews?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}
export type UseReviewsHook = typeof useReviews;

export function useRequest<T extends Record<string, unknown>>(config: T) {
  return useSWR<
    RequestWithHistory & {
      worker: { name: string; color: string };
      guest: { name: string; room: string };
    }
  >(
    `/api/request?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useFoodCategories() {
  return useSWR<FoodCategory[]>(
    "/api/restaurant/categories",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useFoodPositionsCount(id?: string) {
  return useSWR<number>(
    `/api/restaurant/positions/count?${queryString.stringify({ id })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnMount: true,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export type UseCategoriesHook = typeof useFoodCategories;
export type UsePositionsHook = typeof useFoodCategories;
export type UsePositionsCountHook = typeof useFoodPositionsCount;

export function useFoodPositions() {
  return useSWR<(FoodPosition & FoodCategory)[]>(
    "/api/restaurant/positions",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useShopCategories() {
  return useSWR<ShopCategory[]>(
    "/api/shop/categories",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useShopPositions() {
  return useSWR<(ShopPosition & ShopCategory)[]>(
    "/api/shop/positions",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useShopPositionsCount(id?: string) {
  return useSWR<number>(
    `/api/shop/positions/count?${queryString.stringify({ id })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export type UseSpaPositions = (SpaPosition & { staff: User[] })[];

export function useSpaPositions() {
  return useSWR<UseSpaPositions>(
    "/api/spa/positions",
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}

export function useGuests(config: PaginationRequest) {
  return useSWR<PaginationResponse<TableGuest>>(
    `/api/guests?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
      arrayFormat: "comma",
    })}`,
    async (path) => (await axios.get(path)).data
  );
}

export function useGuestRequests(guestId: string | undefined, config: PaginationRequest) {
  return useSWR<PaginationResponse<GuestRequest>>(
    guestId
      ? `/api/guest/${guestId}/requests?${queryString.stringify(config, {
          skipEmptyString: true,
          skipNull: true,
          arrayFormat: "comma",
        })}`
      : null,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useMessageThreads(config: PaginationRequest) {
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
  return useSWR<Guest>(`/api/guest/${guestId}`, async (path) => (await axios.get(path)).data, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
}
