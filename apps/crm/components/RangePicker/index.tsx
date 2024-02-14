import React from 'react';
import { DateRangePickerInput } from "ui";
import DatePicker from "react-datepicker";

interface Props {
    start: Date | null;
    end: Date | null;
    setStart: (d: Date | null) => void;
    setEnd: (d: Date | null) => void;
    placeholder?: string;
}

const RangePicker: React.FC<Props> = ({ start, end, setEnd, setStart, placeholder = "Период" }) => {
    return (
        <DatePicker
            customInput={<DateRangePickerInput />}
            placeholderText={placeholder}
            selectsRange={true}
            startDate={start}
            endDate={end}
            onChange={(update) => {
                setStart(update?.[0]);
                setEnd(update?.[1]);
            }}
            isClearable={true}
        />
    );
};

export default RangePicker;
