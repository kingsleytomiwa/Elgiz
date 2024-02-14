"use client";

import * as React from "react";
import { Box, Typography, Toolbar, Button, CircularProgress } from "@mui/material";
import { Category, SubModule } from "@prisma/client";
import SettingsIcon from "@mui/icons-material/Settings";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Fade from "@mui/material/Fade";
import {
  onCheckModule,
  onCheckSubModule,
  onCheckSubModulesOfModule,
  onCreateModules,
} from "./actions";
import { Modules, useHotel, useModules } from "lib/use-fetch";
import SettingsForm, { HotelSettingsDialog } from "./SettingsForm";
import { Settings } from "./SettingsForm/actions";
import { useTranslation } from "i18n";

const mockedMobileItems = [
  {
    index: 1,
    image: "/assets/mobile/restaurant.svg",
    title: "Ресторан",
    id: Category.RESTAURANT,
  },
  {
    index: 2,
    image: "/assets/mobile/room-service.svg",
    title: "Рум-сервис",
    id: Category.ROOM_SERVICE,
  },
  {
    index: 3,
    image: "/assets/mobile/reception.svg",
    title: "Рецепция",
    id: Category.RECEPTION,
  },
  {
    index: 4,
    image: "/assets/mobile/chat.svg",
    title: "Чат-помощь",
    mode: "blue",
    id: Category.CHAT,
  },
  {
    index: 5,
    image: "/assets/mobile/spa.svg",
    title: "Фитнес-зона",
    id: Category.SPA,
  },
  {
    index: 6,
    image: "/assets/mobile/store.svg",
    title: "Магазин отеля",
    id: Category.SHOP,
  },
];

const reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  result = Object.entries(result).map(([newIndex, item]) => {
    (item as any).index = Number(newIndex) + 1;
    return item;
  });

  return result;
};

export type SubModuleItem = {
  title: string;
  value: boolean;
  id: string;
};

export type ModuleItem = {
  index: number;
  title: string;
  id: string;
  value: boolean;
  subModules: SubModuleItem[];
};

export type MobileItem = {
  index: number;
  image: string;
  title: string;
  id: string;
  mode?: string;
};

const MobileAppContainer = () => {
  // const [modules, setModules] = React.useState<(Module & {subModules?: SubModule[]})[]>([
  const [bigHeight, setBigHeight] = React.useState(false);

  const { data, isLoading: isDataLoading, isValidating, mutate } = useModules();
  const {
    data: hotel,
    isLoading: isHotelLoading,
    isValidating: isHotelValidating,
    mutate: mutateHotel,
  } = useHotel();
  const [openedDialog, setOpenedDialog] = React.useState<HotelSettingsDialog | null>(null);
  const [modules, setModules] = React.useState(data);
  const { t } = useTranslation({ ns: "portal" });

  const [isLoading, setIsLoading] = React.useState(false);
  const [mobileItemRemove, setMobileItemRemove] = React.useState(true);

  const isModulesLoading = isDataLoading || isValidating;

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      modules,
      result.source.index,
      result.destination.index
    ) as Modules;

    setModules(reorderedItems);
    setMobileItemRemove(false);
    setIsLoading(true);
    try {
      await onCreateModules(reorderedItems);
    } catch (err) {
      console.error(err);
    }
    setMobileItemRemove(true);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isModulesLoading) return;

    if (data && data.length > 0) {
      setModules(data);
    }
  }, [isModulesLoading, data]);

  React.useEffect(() => {
    const bigWord = data?.find((item) => t(item.name.toLowerCase()).length > 11);
    if (bigWord) {
      setBigHeight(true);
    }
  }, [data]);

  return (
    <>
      <Toolbar />
      <Box sx={{ display: "flex", gap: "40px", alignItems: "center" }}>
        <Typography variant="h4">{t("application")}</Typography>
        <Button
          startIcon={<SettingsIcon sx={{ fill: "#3F51B5" }} />}
          onClick={() => setOpenedDialog(HotelSettingsDialog.mobileApp)}
        >
          <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>{t("settings")}</Typography>
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: "152px", marginTop: "67px" }}>
        <Box>
          <Typography sx={{ fontWeight: "700", fontSize: "18px" }}>{t("modules")}</Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "348px",
                    marginTop: "24px",
                    overflowY: "auto",
                    height: "100%",
                    "&::-webkit-scrollbar": {
                      width: 0,
                    },
                  }}
                >
                  {(isLoading || isModulesLoading) && <CircularProgress sx={{ mb: 2 }} />}
                  {modules
                    ?.sort((a, b) => (a.index > b.index ? 1 : -1))
                    ?.map((item, i) => (
                      <Draggable key={item.id} draggableId={String(item.index)} index={i}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ModulesItem
                              key={item.id}
                              mutate={mutate}
                              indexModule={item.title}
                              subModules={item.subModules}
                              id={item.id}
                              name={item.name}
                              setModules={setModules}
                              index={i}
                              value={item.value}
                              setOpenedDialog={setOpenedDialog}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
        <Box
          sx={{
            marginTop: "50px",
            width: "245px",
            height: "500px",
            backgroundImage: "url('/assets/phone.png')",
            backgroundSize: "contain",
            position: "sticky",
            top: "80px",
            padding: "13px",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#2B3467",
              width: "220px",
              height: "478px",
              marginTop: "-3px",
              borderRadius: "30px",
              paddingTop: "36px",
              paddingBottom: "36px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#FDFFF1",
                borderRadius: "20px",
                width: "100%",
                height: "100%",
                paddingTop: "34px",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: "700",
                    fontSize: "18px",
                    textAlign: "center",
                    color: "#2B3467",
                  }}
                >
                  Привет, Максим 👋
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "16px",
                    textAlign: "center",
                    marginTop: "16px",
                    color: "#2B3467",
                    textTransform: "capitalize",
                  }}
                >
                  {t("room")} 213
                </Typography>
                {(isLoading || isModulesLoading) && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
              <Box>
                <Box sx={{ height: "255px", paddingX: "16px" }}>
                  <Box
                    sx={{
                      height: "100%",
                      overflowY: "auto",
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "12px",
                      "&::-webkit-scrollbar": { width: 0 },
                      paddingBottom: "10px",
                      borderRadius: "8px",
                      alignItems: "start",
                    }}
                  >
                    {modules
                      ?.sort((a, b) => (a.index > b.index ? 1 : -1))
                      .map((item, i) => (
                        <>
                          {item.value === true && (
                            <Fade key={i} in={mobileItemRemove}>
                              <Box
                                sx={{
                                  wordBreak: "break-all",
                                  borderRadius: "15px",
                                  paddingY: "5px",
                                  paddingLeft: "6px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flexDirection: "column",
                                  height: bigHeight ? "111px" : "100%",
                                  width: "100%",
                                  ...(item?.name === "CHAT"
                                    ? {
                                        color: "white",
                                        backgroundColor: "#2B3467",
                                      }
                                    : {
                                        color: "#2B3467",
                                        backgroundColor: "#BAD7E9",
                                      }),
                                }}
                              >
                                <Image
                                  src={
                                    mockedMobileItems.find((mock) => mock.id === item.name)?.image!
                                  }
                                  alt="mobile icon"
                                  width={61}
                                  height={61}
                                />
                                <Typography
                                  sx={{
                                    fontWeight: "700",
                                    fontSize: "12px",
                                    textAlign: "right",
                                    marginTop: "4px",
                                    marginRight: "6px",
                                  }}
                                >
                                  {t(item.name.toLowerCase())}
                                </Typography>
                              </Box>
                            </Fade>
                          )}
                        </>
                      ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {openedDialog !== null && (
        <SettingsForm
          mutate={mutateHotel}
          isDisabled={isHotelLoading || isHotelValidating}
          settings={hotel?.settings as Settings}
          type={openedDialog}
          onClose={() => setOpenedDialog(null)}
        />
      )}
      {/* <Dialog
        isOpened={open}
        isDisabled={false}
        onCancel={() => setOpen(false)}
        sx={{ py: 3, px: 6 }}
      >
        <Box
          sx={{
            height: "734px",
            minWidth: "1024px",
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "16px",
              marginBottom: "24px",
            }}
          >
            Доступные языки приложения
          </Typography>
          <Box sx={{ display: "flex", gap: "16px" }}>
            {["Русский", "Румынский", "Румынский"].map((item, i) => (
              <Button
                onClick={() => setLangActive(i)}
                key={i}
                sx={
                  langActive === i
                    ? {
                        color: "#3F51B5",
                        backgroundColor: "white",
                        borderRadius: "20px",
                        paddingY: "5px",
                        paddingX: "12px",
                        border: "solid 1px #3F51B5",
                        "&:hover": {
                          background: "white",
                          opacity: 0.8,
                        },
                      }
                    : {
                        color: "white",
                        backgroundColor: "#3F51B5",
                        borderRadius: "20px",
                        paddingY: "5px",
                        paddingX: "12px",
                        border: "solid 1px white",
                        "&:hover": {
                          background: "#3F51B5",
                          opacity: 0.8,
                        },
                      }
                }
              >
                {item}
              </Button>
            ))}
          </Box>
        </Box>
      </Dialog> */}
    </>
  );
};

export const GreenSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "white",
    "&:hover": {
      backgroundColor: "transperent",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#10B981",
    opacity: "1",
  },
}));

const ModulesItem: React.FC<{
  indexModule: string;
  index: number;
  id: string;
  name: string;
  value?: boolean;
  setOpenedDialog: React.Dispatch<React.SetStateAction<HotelSettingsDialog | null>>;
  setModules: React.Dispatch<React.SetStateAction<Modules[0][]>>;
  mutate: () => void;
  subModules: SubModule[];
}> = ({ indexModule, subModules, setModules, id, index, name, value, mutate, setOpenedDialog }) => {
  const isSubModulesChecked = subModules.every((e) => e.value === false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { t } = useTranslation({ ns: "portal" });

  const handleModuleChange = async () => {
    setIsLoading(true);
    setModules((prev) => {
      prev[index].value = !value;
      prev[index].subModules = prev[index].subModules.map((item) => {
        isSubModulesChecked ? (item.value = true) : (item.value = false);
        return item;
      });

      return [
        ...prev.map((item) => ({
          ...item,
        })),
      ];
    });

    try {
      await onCheckModule(id, !value);
      await onCheckSubModulesOfModule(id, !value);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSubModuleChange = async (moduleId: string) => {
    setIsLoading(true);
    let modules;
    setModules((prev) => {
      modules = prev.map((item, i) => {
        if (i === index) {
          item.subModules = item.subModules.map((subModule) =>
            subModule.id === moduleId ? { ...subModule, value: !subModule.value } : subModule
          );
          item.value = item.subModules.some((subModule) => subModule.value === true);
        }

        return { ...item };
      });
      return modules;
    });

    try {
      // getting the latest submodules
      const subModules = modules[index].subModules;
      const currentSubModuleValue = subModules.find((el) => el.id === moduleId).value;

      if (subModules.every((subModule) => subModule.value === false)) {
        await onCheckModule(id, false);
        await onCheckSubModulesOfModule(id, false);
        return;
      }

      if (subModules.some((subModule) => subModule.value === true)) {
        await onCheckModule(id, true);
        if (subModules.every((subModule) => subModule.value === true)) {
          await onCheckSubModulesOfModule(id, true);
          return;
        }
      }

      await onCheckSubModule(moduleId, currentSubModuleValue);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "20px",
        backgroundColor: "#DDE3EE",
        paddingY: "24px",
        paddingRight: "24px",
        paddingLeft: "4px",
        marginBottom: "32px",
      }}
    >
      <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <DragIndicatorIcon sx={{ fill: "#000000", opacity: "0.5" }} />
          <Typography sx={{ fontWeight: "700", fontSize: "14px" }}>
            {t(name.toLowerCase())}
          </Typography>
        </Box>
        <GreenSwitch
          disabled={isLoading}
          checked={!isSubModulesChecked || (!subModules.length && value)}
          onChange={handleModuleChange}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
          gap: "16px",
          paddingLeft: "44px",
        }}
      >
        {subModules
          .sort()
          .filter((el) => !el.hidden && !["CLEANING"].includes(el.name))
          .map((item, i) => (
            <>
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>{t(item.title)}</Typography>
                <Box sx={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  {item.title === "menu" && (
                    <Button
                      onClick={() => setOpenedDialog(HotelSettingsDialog.menu)}
                      sx={{ padding: "2px", minWidth: "25px" }}
                    >
                      <SettingsIcon sx={{ fill: "#9CA3AF" }} />
                    </Button>
                  )}
                  <GreenSwitch
                    disabled={isLoading}
                    value={item.value}
                    checked={item.value}
                    onChange={() => handleSubModuleChange(item.id)}
                  />
                </Box>
              </Box>
            </>
          ))}
      </Box>
    </Box>
  );
};

export default MobileAppContainer;
