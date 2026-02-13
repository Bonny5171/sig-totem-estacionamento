"use client";

import Image from "next/image";
import { Icon } from "@/app/components/Icons";
import LottiePlayer from "@/app/components/LottiePlayer";

export default function WaitingPaymentPage() {
  return (
    <div className="min-h-screen bg-background-isChecking flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <header className="pb-8 mt-[-150px]">
          <div className="flex justify-center">
            <Image
              src={require("../assets/logo.png")}
              alt="Atendimento Paineiras"
              width={160}
              height={50}
              className="object-contain"
            />
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-lg p-10">
          <div className="flex items-center justify-between gap-12 max-h-[200px]">
            <div className="flex items-center gap-5 flex-1">
              <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-background-brand">
                <Icon
                  name="faCreditCard"
                  size={36}
                  className="text-background-brand"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Aguardando pagamento
                </h1>

                <p className="text-gray-500 text-base leading-relaxed max-w-md">
                  Aproxime, insira ou passe seu cartão na máquina ao lado. O
                  processo é rápido e seguro.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center shrink-0 w-[260px] translate-y-3">
              <LottiePlayer size={260} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
