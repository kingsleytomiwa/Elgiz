import { ROUTES } from "../src/routes";

export type RootStackParamList = {
  [key in keyof typeof ROUTES]: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
