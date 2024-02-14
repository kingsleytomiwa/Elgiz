import { View } from "react-native";
import Checkbox from "../../components/ui/Checkbox";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { TouchableOpacity } from "react-native";
import PlusIcon from "../../../assets/icons/plus.svg";
import MinusIcon from "../../../assets/icons/minus.svg";
import CustomText from "../../components/CustomText";

export type Accessory = {
	name: string;
	count: number;
}

type Props = Accessory & {
	onAdd: () => void;
	onSubtract: () => void;
	onClear: () => void;
	count?: number;
	isDisabled?: boolean;
}

const DishesItem: React.FC<Props> = ({ 
	name,
	count,
	onAdd,
	onSubtract,
	onClear,
	isDisabled = false
 }) => {
	return (
		<View className="mt-6 flex flex-row items-center justify-between">
			<View>
				<Checkbox
					label={name}
					value={!!(count && count > 0)}
					onClick={(count && count > 0) ? onClear : onAdd}
				/>
			</View>

			<View
				pointerEvents={count > 0 ? "auto" : "none"}
				className={twMerge(
					"flex flex-row items-center opacity-0",
					count > 0 && "opacity-100"
				)}
			>
				{count && count > 0 && onSubtract ? (
					<>
						<TouchableOpacity
							onPress={onSubtract}
							disabled={isDisabled}
							className="w-6 h-6 rounded-[5px] border border-gray-400 flex items-center justify-center"
						>
							<MinusIcon />
						</TouchableOpacity>
						<CustomText className="mx-4 text-[14px]">{count}</CustomText>
					</>
				) : null}
				{count && count > 0 ? (
					<TouchableOpacity
						onPress={onAdd}
						disabled={isDisabled}
						className="w-6 h-6 rounded-[5px] border border-gray-400 flex items-center justify-center"
					>
						<PlusIcon />
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
};

export default DishesItem;
