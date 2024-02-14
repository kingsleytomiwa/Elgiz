import { Accordion, AccordionDetails, AccordionSummary, Button, Typography, Box, CircularProgress } from "@mui/material";
import Position, { SinglePosition } from "components/AddRequestForm/Position";
import React, { ComponentType, useEffect, useMemo, useState } from "react";
import { Add, ExpandMore } from "@mui/icons-material";
import { Prisma } from "@prisma/client";
import { SWRResponse } from "swr";
import { groupBy } from "lodash";
import { useTranslation } from "i18n";
import i18next from "i18next";

export type PositionItem = {
  id: string;
  name: Prisma.JsonValue;
  description: Prisma.JsonValue;
  categoryId: string;
  imageURL: string;
  price: number;
};

export type CategoryItem = {
  id: string;
  hotelId: string;
  index: number;
  name: Prisma.JsonValue;
};

interface Props<X extends PositionItem, Y extends CategoryItem> {
  showSelectedOnly?: boolean;
  showEmpty?: boolean;
  selectedMenu?: (X & {
    count: number;
  })[];
  setSelectedMenu?: (
    value: React.SetStateAction<
      (X & {
        count: number;
      })[]
    >
  ) => void;
  isEdit?: boolean;

  useData: () => SWRResponse<X[]>;
  useCategories: () => SWRResponse<Y[]>;
  toSinglePosition: (position: X) => SinglePosition;
  onDelete?: (id: string) => void;

  CreateEditForm: ComponentType<{
    mutate: () => void;
    onClose: () => void;
    onDelete: (() => void) | null;
    isDisabled: boolean;
    position: Partial<X> | null;
    categories: Y[];
  }>;
};

export type { Props as PositionMenuProps };

export default function PositionMenu<X extends PositionItem, Y extends CategoryItem>({
  isEdit,
  selectedMenu,
  setSelectedMenu,
  showSelectedOnly,
  showEmpty,
  useData,
  useCategories,
  toSinglePosition,
  CreateEditForm,
  onDelete
}: Props<X, Y>) {
  const { data, isLoading: isDataLoading, mutate } = useData();
  const { data: categoryData, isLoading: isCategoryDataLoading } = useCategories();
  const [position, setPosition] = useState<Partial<X> | null>(null);
  const { t } = useTranslation({ ns: "portal" });

  const isLoading = useMemo(() => isDataLoading || isCategoryDataLoading, [isDataLoading, isCategoryDataLoading]);

  const menu = useMemo(() => {
    return groupBy(data, (val => (categoryData?.find(category => category.id === val.categoryId)?.name as any)?.[i18next.language]));
  }, [data, categoryData]);

  const categories = useMemo(() => categoryData?.sort((a, b) => a.index > b.index ? 1 : -1), [categoryData]);

  useEffect(() => { }, []);

  return (
    <>
      {isLoading && (
        <Box sx={{ overflow: "hidden" }}>
          <CircularProgress />
        </Box>
      )}

      {categories?.map((category) => {
        const categoryName = (category?.name as any)?.[i18next.language];
        const items = menu?.[categoryName];

        if (!showEmpty && !items?.length) {
          return;
        }

        return (
          <Accordion
            key={category.id}
            sx={{
              border: "none",
              boxShadow: "none",
              background: "transparent",
              "&:before": {
                display: "none",
              },
              "& .MuiAccordionSummary-content": {
                flexGrow: "0 !important",
              },
              mb: 3,
            }}
          >
            <AccordionSummary
              disableRipple
              disableTouchRipple
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                opacity: 0.5,
                minHeight: "12px !important",
                height: "12px !important",
                pl: 0,
              }}
              expandIcon={<ExpandMore sx={{ color: "#374151" }} />}
            >
              <Typography
                sx={{
                  color: "#374151",
                  fontSize: "12px",
                  lineHeight: "12px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {categoryName || ""}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              {isEdit && (
                <Box>
                  <Button
                    startIcon={<Add sx={{ fill: "#2B3467", fontSize: 24 }} />}
                    sx={{ border: "1px solid #2B3467", mt: 2, borderRadius: "5px", height: "32px" }}
                    onClick={() => setPosition({ categoryId: category.id } as Partial<X>)}
                    disabled={isLoading}
                  >
                    <Typography sx={{ color: "#2B3467", ml: 0.5, fontSize: "13px" }}>
                      {t("add_a_position")}
                    </Typography>
                  </Button>

                  <CreateEditForm
                    mutate={mutate}
                    isDisabled={isLoading}
                    position={position}
                    onClose={() => setPosition(null)}
                    onDelete={position?.id ? () => onDelete?.(position.id!) : null}
                    categories={categories}
                  />
                </Box>
              )}

              {items?.map((item) => {
                const count = selectedMenu?.find((el) => el.id === item.id)?.count;

                if (showSelectedOnly && (!count || count <= 0)) return;

                return (
                  <Position
                    key={item.id}
                    position={toSinglePosition(item)}
                    onEdit={isEdit ? () => setPosition(item as any) : undefined}
                    onAdd={
                      !isEdit
                        ? () => {
                          setSelectedMenu?.((prevState) => {
                            const newState = [...prevState];
                            const currentIndex = newState.findIndex((el) => el.id === item.id);

                            if (currentIndex !== -1) {
                              newState[currentIndex].count++;
                            } else {
                              newState.push({ ...item, count: 1 });
                            }

                            return newState;
                          });
                        }
                        : undefined
                    }
                    onSubtract={() => {
                      setSelectedMenu?.((prevState) => {
                        const newState = [...prevState];
                        const currentIndex = newState.findIndex((el) => el.id === item.id);

                        if (currentIndex !== -1 && newState[currentIndex].count > 0) {
                          if (newState[currentIndex].count === 1) {
                            newState.splice(currentIndex, 1);
                          } else {
                            newState[currentIndex].count--;
                          }
                        }

                        return newState;
                      });
                    }}
                    count={count}
                  />
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};
