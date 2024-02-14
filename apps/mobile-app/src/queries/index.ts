import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, QUERY_KEYS } from "../../utils/actions";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import queryString from "query-string";
import { queryClient } from "../../App";
import {
  FoodCategory,
  FoodPosition,
  Guest,
  Hotel,
  Message,
  Parameter,
  Request,
  RequestStatus,
  ShopPosition,
  SpaPosition,
  User,
} from "@prisma/client";
import { HotelWithModules } from "../store/atoms";
import { RequestWithHistory } from "utils/models";
import { TimeslotWithLabel } from "utils";

const getHeaders = async (tokenName = "accessToken") => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await AsyncStorage.getItem(tokenName)}`,
});

const refreshSession = async () => {
  const response = await axios.get(`${API_URL}/me/refresh-session`, {
    headers: await getHeaders("refreshToken"),
  });

  const { accessToken } = response.data;
  await AsyncStorage.setItem("accessToken", accessToken);
};

const sendRequest = async (body: AxiosRequestConfig<any>) => {
  const f = async () => {
    const response = await axios({
      ...body,
      url: `${API_URL}${body.url}`,
      headers: await getHeaders(),
    });

    return response.data;
  };

  try {
    return await f();
  } catch (err: any) {
    if ((err as AxiosError)?.response?.status === 401) {
      await refreshSession();
      return await f();
    }
  }
};

export async function onCreateHotelRequest(data: any) {
  await sendRequest({
    url: "/me/request",
    method: "POST",
    data,
  });
  await queryClient.invalidateQueries(QUERY_KEYS.REQUESTS);
}

export async function onUpdateHotel(data: Partial<Hotel>) {
  await sendRequest({
    url: "/me/hotel",
    method: "POST",
    data,
  });
}

export async function onUpdateGuest(data: Partial<Guest>) {
  await sendRequest({
    url: "/me/guest",
    method: "POST",
    data,
  });
}

export async function onCreateHotelRequests(dataArray: any[]) {
  await Promise.all(
    dataArray.map(async (data: any) => {
      await sendRequest({
        url: "/me/request",
        method: "POST",
        data,
      });
    })
  );
  await queryClient.invalidateQueries(QUERY_KEYS.REQUESTS);
}

export async function onCreateReview(data: any) {
  await sendRequest({
    url: "/me/review",
    method: "POST",
    data,
  });
}

export async function onGetGuest() {
  return (
    await sendRequest({
      url: "/me/guest",
      method: "GET",
    })
  )?.data as Guest;
}

export async function setPushToken(data: any) {
  return (
    await sendRequest({
      url: "/me/send-push",
      method: "POST",
      data,
    })
  )?.data as Guest;
}

export async function onGetHotel() {
  return (await sendRequest({
    url: "/me/hotel",
    method: "GET",
  })) as HotelWithModules & { parameters: Parameter[] };
}

export async function onGetRequest(data: { noStatus?: RequestStatus }) {
  return (await sendRequest({
    url: `/me/request?${queryString.stringify(data, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    method: "GET",
  })) as Request;
}

export async function onGetMessages() {
  return (
    await sendRequest({
      url: "/me/messages",
      method: "GET",
    })
  ).data as Message[];
}

export async function onSendMessage(data: any) {
  return await sendRequest({
    url: "/me/message",
    method: "POST",
    data,
  });
}

export async function onGetRestaurantMenu(query: Record<string, unknown>) {
  return (await sendRequest({
    url: `/me/restaurant-menu?${queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    method: "GET",
  })) as FoodPosition[];
}

export async function onGetSPAMenu(query: Record<string, unknown>) {
  return (await sendRequest({
    url: `/me/spa-menu?${queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    method: "GET",
  })) as SpaPosition[];
}

export async function onGetSPATimeslots(query: {
  positionId?: string;
  date?: Date | null;
}) {
  return (await sendRequest({
    url: `/me/spa-slots?${queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    method: "GET",
  })) as TimeslotWithLabel[];
}

export type SpaWorker = Pick<User, "id" | "name" | "image">;
export async function onGetSPATherapists(query: {
  positionId?: string;
  start?: Date | null;
  end?: Date | null;
}) {
  return (await sendRequest({
    url: `/me/spa-therapists?${queryString.stringify(query, {
      skipEmptyString: true,
      skipNull: true,
    })}`,
    method: "GET",
  })) as SpaWorker[];
}

export async function onGetRestaurantCategories() {
  return (await sendRequest({
    url: "/me/restaurant-categories",
    method: "GET",
  })) as FoodCategory[];
}

export async function onGetShop() {
  return ((
    await sendRequest({
      url: "/me/shop",
      method: "GET",
    })
  )?.data || []) as ShopPosition[];
}

export async function onGetRequests() {
  return (await sendRequest({
    url: "/me/requests",
    method: "GET",
  })) as { data: RequestWithHistory[]; count: number };
}
