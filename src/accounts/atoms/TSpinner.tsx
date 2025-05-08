import Lottie from "react-lottie";
import animationData from "../assets/loading-gif.json";

export default function TSpinner({ size = 70 }: { size?: number }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };
  return (
    <Lottie
      isClickToPauseDisabled={true}
      height={size}
      width={size}
      options={defaultOptions}
    />
  );
}
