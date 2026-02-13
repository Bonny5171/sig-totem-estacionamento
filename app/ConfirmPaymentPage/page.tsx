"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Icon } from "@/app/components/Icons";
import Image from "next/image";

export default function ConfirmPaymentPage() {
  const router = useRouter();
  const { detailsTicket, ticketValue } = useAuth();

  const formatarReal = (valor: string) => {
    const valorNumerico = Number(valor);

    return valorNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="min-h-screen bg-background-isChecking flex items-center justify-center px-4">
      <div className="w-full max-w-2xl mt-[-50px]">
        <header className="pb-6">
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

        <div className="bg-white rounded-2xl shadow-lg p-7">
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Confirme as informações
          </h1>

          <div className="space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-gray-600">Tíquete:</span>
              <span className="font-semibold text-gray-900">{ticketValue}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Emissão:</span>
              <span className="font-semibold text-gray-900">
                {detailsTicket?.DATA}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-semibold text-gray-900">
                {detailsTicket?.TIPO}
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-pink-50 py-4 text-center">
            <span className="text-2xl font-bold text-background-brand">
              Valor: {formatarReal(detailsTicket?.VALOR)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <button onClick={() => router.push("WaitingPaymentPage")} className="h-12 rounded-lg bg-background-brand text-white font-semibold text-base hover:bg-pink-700 transition flex items-center justify-center w-full">
              <Icon
                name={"faCreditCard"}
                className="text-white group-hover:text-white mr-2"
                variant="fal"
                size={20}
              />
              Cartão
            </button>

            <button className="h-12 rounded-lg bg-gray-400 text-white font-semibold text-base hover:bg-gray-500 transition flex items-center justify-center w-full">
              <Icon
                name={"faFileInvoiceDollar"}
                className="text-white group-hover:text-white mr-2"
                variant="fal"
                size={20}
              />
              Boleto
            </button>

            <button className="h-12 rounded-lg bg-emerald-500 text-white font-semibold text-base hover:bg-emerald-600 transition flex items-center justify-center w-full">
              <svg
                width="20"
                height="20"
                viewBox="0 0 256 256"
                fill="white"
                className="mr-2"
              >
                <g transform="scale(5.33333,5.33333)">
                  <path d="M11.9,12h-0.68l8.04,-8.04c2.62,-2.61 6.86,-2.61 9.48,0l8.04,8.04h-0.68c-1.6,0 -3.11,0.62 -4.24,1.76l-6.8,6.77c-0.59,0.59 -1.53,0.59 -2.12,0l-6.8,-6.77c-1.13,-1.14 -2.64,-1.76 -4.24,-1.76z" />
                  <path d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61 -6.86,2.61 -9.48,0l-8.04,-8.04h0.68c1.6,0 3.11,-0.62 4.24,-1.76l6.8,-6.77c0.59,-0.59 1.53,-0.59 2.12,0l6.8,6.77c1.13,1.14 2.64,1.76 4.24,1.76z" />
                  <path d="M44.04,28.74l-5.26,5.26h-2.68c-1.07,0 -2.07,-0.42 -2.83,-1.17l-6.8,-6.78c-1.36,-1.36 -3.58,-1.36 -4.94,0l-6.8,6.78c-0.76,0.75 -1.76,1.17 -2.83,1.17h-2.68l-5.26,-5.26c-2.61,-2.62 -2.61,-6.86 0,-9.48l5.26,-5.26h2.68c1.07,0 2.07,0.42 2.83,1.17l6.8,6.78c0.68,0.68 1.58,1.02 2.47,1.02c0.89,0 1.79,-0.34 2.47,-1.02l6.8,-6.78c0.76,-0.75 1.76,-1.17 2.83,-1.17h2.68l5.26,5.26c2.61,2.62 2.61,6.86 0,9.48z" />
                </g>
              </svg>
              PIX
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-4 w-full h-12 rounded-lg bg-gray-200 text-gray-700 font-semibold text-base hover:bg-gray-300 transition"
          >
            ✕ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
