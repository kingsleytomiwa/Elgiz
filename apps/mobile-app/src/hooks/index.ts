import { UseMutationOptions, useMutation, useQuery } from "react-query";
import {
  onGetGuest,
  onGetHotel,
  onGetMessages,
  onGetRequest,
  onGetRequests,
  onGetRestaurantCategories,
  onGetRestaurantMenu,
  onGetSPAMenu,
  onGetSPATherapists,
  onGetSPATimeslots,
  onGetShop,
} from "../queries";
import { queryClient } from "../../App";
import { TimeslotWithLabel } from "utils";
import queryString from "query-string";

export function useOptimisticMutation(
  options: UseMutationOptions,
  key: string | string[],
  item: Record<string, unknown>
) {
  return useMutation({
    ...options,
    // When mutate is called:
    onMutate: async (newItem: any) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: key });

      // Snapshot the previous value
      const previousArray = queryClient.getQueryData(key);

      // Optimistically update to the new value
      queryClient.setQueryData(key, (prev: any) => [
        ...prev,
        { ...newItem, ...item },
      ]);

      // Return a context object with the snapshotted value
      return { previousArray };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(key, context?.previousArray);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useGuest(config: any = { enabled: true }) {
  return useQuery("me", () => onGetGuest(), {
    async onError(err) {
      console.error(err);
    },
    ...config,
    refetchOnWindowFocus: false,
    cacheTime: 1800000,
    retry: 1,
  });
}

export function useHotel(config: any = { enabled: true }) {
  return useQuery("hotel", () => onGetHotel(), {
    async onError(err) {
      console.error(err);
    },
    ...config,
    refetchOnWindowFocus: false,
    retry: 1,
    cacheTime: 1800000,
    staleTime: 1800000,
  });
}

export function useLastRequest(config: any = { enabled: true }) {
  return useQuery(
    "last-request",
    () =>
      onGetRequest({
        noStatus: "COMPLETED",
      }),
    {
      async onError(err) {
        console.error(err);
      },
      ...config,
      refetchOnWindowFocus: false,
      retry: 0,
      cacheTime: 1800000,
      refetchInterval: 30000,
      staleTime: 5000,
    }
  );
}

export function useSpaTimeSlots(positionId?: string, date?: Date | null) {
  return useQuery(
    ["spa-timeslots", positionId, date],
    () => onGetSPATimeslots({ positionId, date }),
    {
      async onError(err) {
        console.error(err);
      },
      refetchOnWindowFocus: false,
      retry: 0,
      cacheTime: 300000,
      enabled: !!positionId && !!date,
    }
  );
}

export function useSpaTherapists(
  positionId?: string,
  start?: Date,
	end?: Date,
	enabled = true
) {
  return useQuery(
    ["spa-therapists", positionId, start, end],
    () => onGetSPATherapists({positionId, start, end}),
		{
			async onError(err) {
        console.error(err);
      },
      refetchOnWindowFocus: false,
      retry: 0,
      cacheTime: 300000,
      enabled: !!positionId && !!start && !!end && enabled,
		}
  );
}

export function useShopPositions() {
  return useQuery("shop-positions", () => onGetShop(), {
    async onError(err) {
      console.error(err);
    },
    refetchOnWindowFocus: false,
    retry: 0,
    cacheTime: 1800000,
  });
}

export function useRequests() {
  return useQuery("requests", () => onGetRequests(), {
    async onError(err) {
      console.error(err);
    },
    cacheTime: 300000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
}

export function useMessages() {
  return useQuery("messages", () => onGetMessages(), {
    async onError(err) {
      console.error(err);
    },

    refetchOnWindowFocus: false,
    cacheTime: 1800000,
    refetchInterval: 30000,
  });
}

export function useRestaurantMenu(query: Record<string, unknown>) {
  return useQuery(["restaurant", query], () => onGetRestaurantMenu(query), {
    async onError(err) {
      console.error(err);
    },
    refetchOnWindowFocus: false,
    cacheTime: 300000,
    retry: 0,
  });
}

export function useRestaurantCategories() {
  return useQuery("restaurant-categories", () => onGetRestaurantCategories(), {
    async onError(err) {
      console.error(err);
    },
    refetchOnWindowFocus: false,
    cacheTime: 300000,
    retry: 0,
  });
}

export function useSpaMenu(query: Record<string, unknown>) {
  return useQuery(["spa", query], () => onGetSPAMenu(query), {
    async onError(err) {
      console.error(err);
    },
    refetchOnWindowFocus: false,
    cacheTime: 300000,
    retry: 0,
  });
}
