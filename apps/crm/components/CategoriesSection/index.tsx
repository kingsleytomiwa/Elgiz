import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Typography } from "@mui/material";
import { UseCategoriesHook, UsePositionsCountHook } from "lib/use-fetch";
import { FoodCategory } from "@prisma/client";
import AddCategoryForm from "../AddCategoryForm";
import { CategoryItem } from "components/PositionMenu";
import { OutputLanguage } from "src/utils/constants";
import i18next from "i18next";

const reorder = (list, startIndex, endIndex) => {
  let result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  result = Object.entries(result).map(([newIndex, item]) => {
    (item as FoodCategory).index = Number(newIndex) + 1;
    return item;
  });

  return result;
};

type Props = {
  useData: UseCategoriesHook;
  useDataCount: UsePositionsCountHook;
  action: (data?: OutputLanguage, id?: string) => Promise<void>;
  deleteAction: (id?: string) => Promise<void>;
  onDragItem: (data: any) => Promise<void>;
};

export type DialogType = "update" | "delete" | null;

const CategoriesSection: React.FC<Props> = ({
  useData,
  action,
  deleteAction,
  useDataCount,
  onDragItem,
}) => {
  const [items, setItems] = React.useState<any[]>();
  const [activeCategory, setActiveCategory] = React.useState<CategoryItem>();
  const [openedDialog, setOpenedDialog] = React.useState<DialogType>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { data, isLoading: isFoodCategoriesLoading, isValidating, mutate } = useData();

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(data, result.source.index, result.destination.index) as any[];

    try {
      setIsLoading(true);

      setItems(reorderedItems);
      await onDragItem(reorderedItems);
    } catch (e) { }
    setIsLoading(false);
    mutate();
  };

  useEffect(() => {
    setItems(data);
  }, [data]);

  const isDisabled = isFoodCategoriesLoading || isLoading || isValidating;

  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "start", mb: 5, height: "32px" }}>
      <AddCategoryForm
        mutate={mutate}
        category={activeCategory}
        isDisabled={isDisabled}
        action={action}
        deleteAction={deleteAction}
        useDataCount={useDataCount}
        openedDialog={openedDialog}
        setOpenedDialog={setOpenedDialog}
        setActiveCategory={setActiveCategory}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal" isDropDisabled={isDisabled}>
          {(provided, snapshot) => (
            <Box ref={provided.innerRef} sx={{ display: "flex" }} {...provided.droppableProps}>
              {items
                ?.sort((a, b) => (a.index > b.index ? 1 : -1))
                ?.map((item, index) => (
                  <Draggable
                    key={item.index}
                    draggableId={String(item.index)}
                    index={index}
                    isDragDisabled={isDisabled}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#2B3467",
                          color: "#FDFFF1",
                          px: 1,
                          py: 1,
                          height: "32px",
                          userSelect: "none",
                          mr: "12px",
                          borderRadius: "5px",
                          cursor: "grab",
                          opacity: isDisabled ? 0.5 : 1,
                        }}
                        onClick={() => {
                          setActiveCategory(item);
                          setOpenedDialog("update");
                        }}
                      >
                        <Typography sx={{ fontSize: "13px", textTransform: "capitalize" }}>
                          {(item?.name?.[i18next.language] as any) ?? ""}
                        </Typography>
                      </Box>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default CategoriesSection;
