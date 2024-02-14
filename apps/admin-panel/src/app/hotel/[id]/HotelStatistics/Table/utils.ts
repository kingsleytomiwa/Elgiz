import { Category } from "@prisma/client";
import { CategoryLabelDefault } from "utils";

export interface Column {
  id: "name" | "count";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

export const categoriesColumns: readonly Column[] = [
  { id: "name", label: "Категория запросов", minWidth: 200 },
  { id: "count", label: "Количество", minWidth: 200 },
];

export const requestsColumns: readonly Column[] = [
  { id: "name", label: "Запрос", minWidth: 200 },
  { id: "count", label: "Количество", minWidth: 200 },
];

export interface Data {
  id: number | string;
  name: string;
  count: number;
}

export function createCategoriesData(id: Category, count: number | null): Data {
  return { id, name: CategoryLabelDefault[id], count: count ?? 0 };
}

export function createRequestsData(id: Data["id"], name: string, count: number | null): Data {
  return { id, name, count: count ?? 0 };
}

export const getCellColor = (isActive: boolean, columnId: string, rowIsPaid?: boolean) => {
if (isActive) {
	return { backgroundColor: "#3F51B5", color: "white" };
}

if (columnId === "amount" || (rowIsPaid !== undefined && rowIsPaid)) {
  return { color: "#3F51B5" };
}
	return { color: "black" };
};
