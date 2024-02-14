import { View } from "react-native";
import DropdownPicker from "../../../components/ui/DropdownPicker";
import { useAtom, useAtomValue } from "jotai";
import { dateAtom, positionsAtom, spaTimeslotsAtom } from "../../../store/atoms";
import { SpaPosition } from "@prisma/client";
import { TimeslotWithLabel } from "utils";
import { useSpaTimeSlots } from "../../../hooks";
import { useState } from "react";

export const SPADropdownPicker = ({ disabled = false }) => {
  const [select, setSelect] = useAtom(spaTimeslotsAtom);
  const [open, setOpen] = useState(false);
  const positions = useAtomValue(positionsAtom);
  const date = useAtomValue(dateAtom);

  const selectedPosition = positions?.[0] as SpaPosition | undefined;
  const { data } = useSpaTimeSlots(selectedPosition?.id, date);

  const isPickerMultiple = !selectedPosition?.duration ?? false;

  const generalProps = {
    showTickIcon: true,
    open: !!open,
    setOpen,
    textStyle: { color: "black" },
    style: { width: 150, backgroundColor: "#BAD7E9", borderColor: "transparent", borderRadius: 15 },
    disabled: !date || disabled,
    items: (data || []) as any,
    placeholder: "Время",
  };

  return (
    <View>
      {isPickerMultiple ? (
        <DropdownPicker
          {...generalProps}
          multiple
          // @ts-ignore
          onSelectItem={(val: TimeslotWithLabel[]) => {
            setSelect((prev: TimeslotWithLabel[]) => {
              const label = val?.[0]?.label;
              if (prev?.find((el) => el.label === label)) {
                return prev.filter((el) => el.label !== label);
              } else {
                return [...prev, val?.[0]] as TimeslotWithLabel[];
              }
            });
          }}
          // @ts-ignore
          value={select}
          multipleText={select?.map((el) => el?.label).join(",")}
        />
      ) : (
        <DropdownPicker
          {...generalProps}
          placeholder={select?.[0]?.label ?? "Время"}
          multiple={false}
          // @ts-ignore
          onSelectItem={(val: TimeslotWithLabel) => {
            return setSelect((prev: TimeslotWithLabel[]) => {
              if (prev?.[0]?.label === val?.label) {
                return [];
              } else {
                return [val];
              }
            });
          }}
          value={[]}
        />
      )}
    </View>
  );
};
export default SPADropdownPicker;
