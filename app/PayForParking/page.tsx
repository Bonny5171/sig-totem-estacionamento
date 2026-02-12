"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import BarcodeScanner from "@/app/components/BarcodeScanner";

export default function TicketReaderPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background-isChecking flex items-center justify-center px-4">
      <div className="w-full max-w-3xl mt-[-50px]">

        <header className="pb-8">
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

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">
            Aproxime seu tíquete do leitor
          </h1>

          <p className="text-center text-gray-500 text-base mb-6">
            Posicione o código de barras em frente ao leitor. O pagamento será feito em seguida.
          </p>

          <BarcodeScanner />

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => router.back()}
              className="h-12 rounded-lg bg-gray-200 text-gray-700 font-medium text-base hover:bg-gray-300 transition"
            >
              Voltar
            </button>

            <button 
              onClick={() => router.push("/DigitTicketPage")}
              className="h-12 rounded-lg bg-background-brand text-white font-semibold text-base hover:bg-pink-700 transition"
              >
                Digitar código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
