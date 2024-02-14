import { i18n } from "../../../App";
import Status from "../../components/Status";
import Item from "../../components/Status/item";
import { ROUTES } from "../../routes";

const RoomServiceStatusScreen = () => {
  
  
  return (
    <Status
      title={i18n?.t("application_status")}
      description={i18n?.t("in_the_main_menu_you_will_have_access_to_your_order")}
      image={require("../../../assets/image/table.png")}
      buttonText={i18n?.t("main_menu")}
      buttonTo={ROUTES.Main}
    >
      <Item status="process" text={i18n?.t("the_order_was_sent_to_the_operator")} />
    </Status>
  );
};

export default RoomServiceStatusScreen;
