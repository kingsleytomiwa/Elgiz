import Constants from "expo-constants";

const LOCALHOST =
  (Constants.expoConfig as any)?.hostUri;

export const API_URL = LOCALHOST
  ? `http://${LOCALHOST.split(`:`).shift()}:3000/api/v1`
  : "https://portal.elgiz.io/api/v1";

export const QUERY_KEYS = {
  ME: (code: string) => ["me", code],
  HOTEL: {
    DETAILS: (id: string) => ["hotel", id],
  },
  SHOP: "shop",
  REQUESTS: "requests",
  MESSAGES: "messages",
  FOOD_POSITIONS: "food-positions",
  SPA_POSITIONS: "spa-positions",
  FOOD_CATEGORIES: "food-categories",
};
