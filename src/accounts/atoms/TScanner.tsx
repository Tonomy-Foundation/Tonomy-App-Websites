import Lottie from "react-lottie";
import animationData from "../assets/scanning-qr-gif.json";

export default function TScanner({
  height = 100,
  width = 100,
}: {
  height?: number;
  width?: number;
}) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
  };

  return (
    <Lottie
      isClickToPauseDisabled={true}
      height={height}
      width={width}
      options={defaultOptions}
    />
  );
}
