"use client";

import {
  Dashboard,
  Restaurant,
  Settings,
  WorkspacesOutlined,
  People,
  Store,
  Computer,
  TrackChanges,
  Chat,
  SupervisorAccount,
  Spa,
  Storefront,
} from "@mui/icons-material";

export const menus = [
  [
    { text: "control_panel", Icon: Dashboard, link: "/" },
    { text: "guests", Icon: People, link: "/guests" },
    { text: "requests", Icon: TrackChanges, link: "/requests" },
  ],

  [
    {
      text: "restaurant",
      Icon: Restaurant,
      link: "/restaurant",
      getActive: (current: string) => ["/restaurant", "/restaurant/catalog"].includes(current),
    },
    {
      text: "shop",
      Icon: Storefront,
      link: "/shop",
      getActive: (current: string) => ["/shop", "/shop/catalog"].includes(current),
    },
    {
      text: "reception",
      Icon: Computer,
      link: "/reception",
      getActive: (current: string) => ["/reception", "/reception/reviews"].includes(current),
    },
    {
      text: "spa",
      Icon: Spa,
      link: "/spa",
      getActive: (current: string) => ["/spa", "/spa/schedule", "/spa/catalog"].includes(current),
    },
  ],

  [
    { text: "application", Icon: WorkspacesOutlined, link: "/application" },
    { text: "hotel_staff", Icon: SupervisorAccount, link: "/staff" },
    { text: "chat", Icon: Chat, link: "/chat" },
    { text: "settings", Icon: Settings, link: "/settings" },
  ],
];
