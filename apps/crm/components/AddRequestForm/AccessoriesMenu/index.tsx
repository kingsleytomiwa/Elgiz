import React from "react";
import DishPosition, { Dish } from "../DishPosition";
import { useTranslation } from "i18n";

export const additionalServicesItems = (t): Dish[] => [
	{ name: t("a_set_of_towels") },
	{ name: t("bedding_set") },
	{ name: t("pillow") },
	{ name: t("blanket") },
	{ name: t("bath_rug") },
	{ name: t("robe") },
	{ name: t("slippers") },
	{ name: t("feng") },
	{ name: t("berushi") },
	{ name: t("set_of_thread_needle") },
];

export const dishes = (t): Dish[] => [
	{ name: t("plate") },
	{ name: t("spoon") },
	{ name: t("fork") },
	{ name: t("cup") },
	{ name: t("corkscrew") },
	{ name: t("a_set_of_disposable_dishes") },
];

export type Accessory = {
	name: string
}

type MenuProps = {
	accessories: Accessory[];
	selectedDishes: (Accessory & {
		count: number;
	})[];
	setSelectedDishes: (
		value: React.SetStateAction<
			(Accessory & {
				count: number;
			})[]
		>
	) => void;
};

const AccessoriesMenu: React.FC<MenuProps> = ({ accessories, selectedDishes, setSelectedDishes }) => {
	return (
		<>
			{accessories.map(dish => {
				const count = selectedDishes?.find((el) => el.name === dish.name)?.count;
				return (
					<DishPosition
						key={dish.name}
						name={dish.name}
						count={count}
						onAdd={() => {
							setSelectedDishes &&
								setSelectedDishes((prevState) => {
									const newState = [...prevState];
									const currentIndex = newState.findIndex((el) => el.name === dish.name);
									if (currentIndex !== -1) {
										newState[currentIndex].count = newState[currentIndex].count + 1;
									} else {
										newState.push({ ...dish, count: 1 });
									}

									return newState;
								});
						}}
						onSubtract={() => {
							setSelectedDishes &&
								setSelectedDishes((prevState) => {
									const newState = [...prevState];
									const currentIndex = newState.findIndex((el) => el.name === dish.name);
									if (currentIndex !== -1) {
										newState[currentIndex].count = newState[currentIndex].count - 1;
									}

									return newState;
								});
						}}
						onClear={() => setSelectedDishes &&
							setSelectedDishes((prevState) => {
								const newState = [...prevState];
								const currentIndex = newState.findIndex((el) => el.name === dish.name);
								newState.splice(currentIndex, 1)

								return newState;
							})
						}
					/>
				)
			})}
		</>
	)
};

export default AccessoriesMenu;
