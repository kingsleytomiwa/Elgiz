import { COUNTRY_OPTIONS } from "utils/constants";
import Select from "../Select";

const CountrySelect: React.FC<React.ComponentProps<"select">> = (props) => {
    return (
        <Select
            options={COUNTRY_OPTIONS}
            label='Страна'
            {...props}
        />
    );
};

export default CountrySelect;
