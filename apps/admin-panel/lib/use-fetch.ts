import useSWR from "swr";
import {
  PaginationRequest as BackendPaginationRequest,
  PaginationResponse,
} from "backend-utils/pagination";
import axios from "axios";
import queryString from "query-string";
import { Settings } from "components/SettingsContainer/SettingsForm";

type PaginationRequest = Omit<BackendPaginationRequest, "skip">;

export function useHotels(pagination: PaginationRequest) {
  return useSWR<PaginationResponse>(
    `/api/hotels?${queryString.stringify(pagination, { skipEmptyString: true, skipNull: true })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 300000,
    }
  );
}

export function useHotelPayments(hotelId: string) {
  return useSWR<PaginationResponse>(
    `/api/hotel-payments?${queryString.stringify({ hotelId })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useCategories(config: {
  hotelId: string;
  startDate: Date | null;
  endDate: Date | null;
}) {
  return useSWR<PaginationResponse>(
    `/api/hotel-categories?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useSettings({ userId }: { userId: string }) {
  return useSWR<Settings>(
    `/api/settings?${queryString.stringify({ userId }, { skipEmptyString: true, skipNull: true })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
}

export function useRequests(config: {
  hotelId: string;
  category: string;
  startDate: Date | null;
  endDate: Date | null;
}) {
  return useSWR<PaginationResponse>(
    `/api/hotel-requests?${queryString.stringify(config, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    async (path) => (await axios.get(path)).data,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );
}
