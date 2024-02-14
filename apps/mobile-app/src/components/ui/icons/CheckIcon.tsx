import { Path, Svg, SvgProps } from "react-native-svg";

const CheckIcon = ({
  className,
  ...rest
}: SvgProps & { className?: string }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 12.9L10.1429 16.5L18 7.5"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default CheckIcon;
