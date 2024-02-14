import * as React from "react";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import HelpIcon from "@mui/icons-material/Help";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter, usePathname } from "next/navigation";
import { SvgIconComponent } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { AdminNotification, Guest, Hotel, Notification, UserNotification } from "@prisma/client";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import queryString from "query-string";
import { onDeleteNotification, onReadNotification, readAllNotifications } from "./actions";
import { RequestTypeLabel, CategoryLabel, NotificationTypeLabel, NotificationTypeLabelDefault } from "utils";
import { useTranslation } from "i18n";
import { signOut } from "next-auth/react";

const drawerWidth = 240;

type DrawerProps = React.PropsWithChildren & {
  menus: { text: string; Icon: SvgIconComponent; link?: string; getActive?: (current: string) => boolean; }[][];
  isAdmin: boolean;
};

type OwnerNotification = (Notification & { guest: Guest; }) & { hotel: Hotel; } & {
  userNotifications?: UserNotification[];
};
function useNotifications(isAdmin: boolean) {
  const key = `/api/notifications?${queryString.stringify(
    { isAdmin },
    {
      skipEmptyString: true,
      skipNull: true,
    }
  )}`;

  return {
    key,
    hook: useSWR<{
      notifications: (OwnerNotification | (AdminNotification & { hotel: Hotel; }))[];
      count: number;
    }>(key, async (path) => (await axios.get(path)).data, {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 300000,
    }),
  };
}

export default function Drawer({ menus, isAdmin, children }: DrawerProps) {
  const { push } = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation({ ns: "portal" });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOpenNotification, setIsOpenNotification] = React.useState(false);
  const {
    key,
    hook: { data, isLoading },
  } = useNotifications(isAdmin);
  const { mutate } = useSWRConfig();

  const onReadAll = async () => {
    try {
      await mutate(key, readAllNotifications(isAdmin));
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete =
    (notification: Notification | AdminNotification, roleNotificationId?: string) => async () => {
      try {
        // await ;
        await mutate(key, onDeleteNotification(isAdmin, { ...notification, roleNotificationId }), {
          optimisticData: (cur) => {
            return cur?.notifications?.filter((el) => el.id !== notification.id);
          },
        });
      } catch (err) {
        console.error(err);
      }
    };

  const onRead = async (
    notification: Notification | AdminNotification,
    roleNotificationId?: string
  ) => {
    try {
      await mutate(key, onReadNotification(isAdmin, { ...notification, roleNotificationId }), {
        optimisticData: (cur) => {
          const currentNotif = cur?.notifications?.findIndex((el) => el.id !== notification.id);
          if (cur?.notifications?.[currentNotif]) {
            cur.notifications[currentNotif].wasRead = true;
          }
          return cur;
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "white",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <Box sx={{ mr: 1, p: 1 }}>
            <Link href="/">
              <HelpIcon sx={{ fill: "#6B7280", fontSize: 20 }} />
            </Link>
          </Box>

          <Box
            sx={{
              mr: 1,
              p: 1,
            }}
            onClick={() => setIsOpenNotification(!isOpenNotification)}
          >
            <NotificationsIcon sx={{ fill: "#6B7280", fontSize: 20 }} />
          </Box>

          <Box sx={{ p: 1, cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>
            <Box>
              <PersonIcon sx={{ fill: "#6B7280", fontSize: 30 }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: "-75px",
                right: 0,
                width: "156px",
                paddingX: "12px",
                paddingY: "8px",
                color: "black",
                background: "white",
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)",
                fontSize: "14px",
                gap: "16px",
                opacity: isOpen ? "1" : "0",
                pointerEvents: isOpen ? "auto" : "none",
                transition: ".3s ease",
                zIndex: "50",
              }}
            >
              <Link href={"/profile"}>{isAdmin ? "profile" : t("profile")}</Link>
              <Box onClick={() => signOut()}>{isAdmin ? "go_out" : t("go_out")}</Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "65px",
              right: "0",
              width: "680px",
              height: "516px",
              paddingX: "10px",
              paddingY: "8px",
              color: "black",
              background: "#F3F4F6",
              boxShadow:
                "0px 1px 2px 0px rgba(100, 116, 139, 0.10), 0px 1px 1px 0px rgba(100, 116, 139, 0.06)",
              opacity: isOpenNotification ? "1" : "0",
              pointerEvents: isOpenNotification ? "auto" : "none",
              transition: ".3s ease",
              borderRadius: "0 0 20px 20px",
              zIndex: "50",
            }}
          >
            <Box
              sx={{
                background: "white",
                width: "100%",
                height: "100%",
                paddingTop: "16px",
                paddingX: "14px",
                borderRadius: "20px",
              }}
            >
              <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>{isAdmin ? "Уведомления" : t("notifications")}</Typography>
                  <Box
                    sx={{
                      borderRadius: "100%",
                      background: "#3F51B5",
                      paddingX: "6px",
                      display: "flex",
                      alignItems: "center",
                      height: "19px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      {data?.count}
                    </Typography>
                  </Box>
                </Box>
                {data?.count && data.count > 0 ? (
                  <Button onClick={onReadAll}>{isAdmin ? "Отметить все, как прочитанные" : t("note_everything_as_read")}</Button>
                ) : null}
              </Box>
              <Box
                sx={{
                  marginTop: "53px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  height: "388px",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": {
                    width: "0.4em",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "white",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#bfbfbf",
                    borderRadius: "10px",
                  },
                }}
              >
                {isLoading && (
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                )}
                {data?.notifications?.map((notif) => {
                  // we get userNotif by notif id so its always one notif here for one user
                  const roleNotification = isAdmin
                    ? (notif as AdminNotification)
                    : (notif as OwnerNotification)?.userNotifications?.[0];

                  if (roleNotification?.wasRemoved) return;

                  const notificationData = notif?.data as any;
                  const onOpen = async () => {
                    setIsOpenNotification(false);
                    try {
                      await onRead(notif, roleNotification?.id);

                      !isAdmin &&
                        push(
                          `/requests?${queryString.stringify(
                            { selected: notificationData?.requestId },
                            {
                              skipEmptyString: true,
                              skipNull: true,
                              arrayFormat: "comma",
                            }
                          )}`
                        );
                    } catch (err) {
                      console.error(err);
                    }
                  };

                  return (
                    <NotificationItem
                      key={roleNotification?.id}
                      isAdmin={isAdmin}
                      isRead={roleNotification?.wasRead ?? false}
                      date={new Date(notif.createdAt!)}
                      module={notificationData?.section}
                      request={notificationData?.type}
                      data={notificationData}
                      guest={(notif as any)?.guest}
                      onDelete={onDelete(notif, roleNotification?.id)}
                      onOpen={onOpen}
                      type={notif!.type!}
                      hotel={notif!.hotel!}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
          <Box
            onClick={() => {
              setIsOpenNotification(false);
              setIsOpen(false);
            }}
            sx={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100vw",
              height: "100vh",
              zIndex: "40",
              pointerEvents: isOpenNotification || isOpen ? "auto" : "none",
            }}
          />
        </Toolbar>
      </AppBar>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#111827",
            pt: 10,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          {menus?.map((menu, index) => (
            <List
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                backgroundColor: "#363E4E",
                p: 2,
                pr: 1,
                mx: 0.5,
                mb: 0.8,
                borderRadius: "10px",
              }}
            >
              {menu?.map((item) => {
                // @ts-ignore
                const isActive = item.getActive?.(pathname) ?? pathname === item.link;

                return (
                  <ListItem
                    key={item.text}
                    disablePadding
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: isActive ? "#464c5d" : "transparent",
                    }}
                    onClick={() => item?.link && push(item.link)}
                  >
                    <ListItemButton sx={{ borderRadius: "8px" }}>
                      <ListItemIcon sx={{ minWidth: "24px", mr: 1 }}>
                        {<item.Icon sx={{ fill: isActive ? "#10B981" : "" }} />}
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            sx={{
                              color: isActive ? "#10B981" : "#D1D5DB",
                              fontWeight: isActive ? 700 : 600,
                              fontSize: "14px",
                            }}
                          >
                            {/* TODO! Divide admin-panel and crm drawers */}
                            {isAdmin ? item.text : t(item.text)}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          ))}
        </Box>

        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            opacity: 0.5,
            p: 3,
            mb: 3,
          }}
        >
          <Link href="https://www.elgiz.io/" target="_blank">
            <Typography sx={{ fontSize: "14px", textDecoration: "underline", color: "white" }}>
              {t("elgiz_made")}
            </Typography>
          </Link>
        </Toolbar>
      </MuiDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "100%" }}>
        {children}
      </Box>
    </Box>
  );
}

interface NotificationData {
  isRead: boolean;
  module: string;
  guest: Partial<Guest>;
  request: string;
  date: Date;
  onDelete: () => void;
  onOpen?: () => void;
  type: string;
  data: any;
  hotel: Partial<Hotel>;
  isAdmin?: boolean;
}

const NotificationItem: React.FC<NotificationData> = ({
  isRead,
  module,
  guest,
  request,
  date,
  onDelete,
  onOpen,
  type,
  data,
  hotel,
  isAdmin
}) => {
  const { t } = useTranslation({ ns: "portal" });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "end",
        paddingLeft: "14px",
        paddingY: "16px",
        paddingRight: "24px",
        borderBottom: "1px solid #e6e6e6",
      }}
    >
      <Box sx={{ flex: 1, cursor: "pointer" }} onClick={onOpen}>
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Box
              sx={{
                borderRadius: "100%",
                background: "#3F51B5",
                width: "8px",
                height: "8px",
                display: isRead ? "none" : "block",
              }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                color: isRead ? "#65748B" : "#3F51B5",
              }}
            >
              {isAdmin ? NotificationTypeLabelDefault[type] : t(NotificationTypeLabel[type])}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "14px", opacity: "0.5" }}>
            {date.getHours() + ":" + date.getMinutes()}
          </Typography>
        </Box>

        {type === "HOTEL_REQUEST_CREATED" ? (
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "14px",
              marginTop: "6px",
            }}
          >
            <Box sx={{ minWidth: "238px" }}>
              <Typography>
                <span style={{ opacity: "0.5" }}>{t("module")} </span>
                {t(CategoryLabel?.[module])}
              </Typography>
              <Typography sx={{ marginTop: "8px" }}>
                <span style={{ opacity: "0.5" }}>{t("guest")}: </span>
                {guest?.name}
              </Typography>
            </Box>
            <Box>
              <Typography>
                <span style={{ opacity: "0.5" }}>{t("request")}: </span>
                {t(RequestTypeLabel?.[request])}
              </Typography>
              <Typography sx={{ marginTop: "8px" }}>
                <span style={{ opacity: "0.5" }}>{t("room")}: </span>
                {guest?.room}
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            <Typography sx={{ mt: "6px" }}>
              <span style={{ opacity: "0.5" }}>Отель: </span>
              {hotel?.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "24px",
                fontSize: "14px",
              }}
            >
              {type === "PAYMENT" ? (
                <>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Длительность: </span>
                      {data.duration}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Количество комнат: </span>
                      {hotel?.rooms}
                    </Typography>
                  </Box>
                </>
              ) : type === "ROOMS_QUANTITY_CHANGE_REQUEST" ? (
                <>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Сейчас доступно номеров: </span>
                      {data.increaseBy}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Увеличить на: </span>
                      {data.availableRooms}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Расчетный период: </span>
                      {data?.billingPeriod}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ marginTop: "8px" }}>
                      <span style={{ opacity: "0.5" }}>Сумма к оплате: </span>
                      {data?.amount}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
      <Button sx={{ padding: "2px", minWidth: "0" }} onClick={onDelete}>
        <DeleteIcon sx={{ width: "16px", height: "16px", color: "#3F50B4" }} />
      </Button>
    </Box>
  );
};
