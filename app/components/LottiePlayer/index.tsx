"use client";

import Lottie from "lottie-react";
import animation from "@/app/assets/animations/StoneMaquina.json";

type Props = {
  size?: number;
};

export default function LottiePlayer({ size = 140 }: Props) {
  return (
    <div style={{ width: size, height: size, marginTop: 80 }}>
      <Lottie
        animationData={animation}
        loop
        autoplay
      />
    </div>
  );
}
