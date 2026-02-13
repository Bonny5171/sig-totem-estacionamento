"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useCallback } from "react";
import { checkTicket } from "@/app/api/services/acessoService";
import { useAuth } from "@/app/contexts/AuthContext";
import Alert from "@/app/components/Alert";

export default function DigitTicketPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setDetailsTicket, setTicketValue } = useAuth();

  const MAX = 14;

  function addDigit(n: string) {
    if (code.length < MAX) setCode((prev) => prev + n);
  }

  function clear() {
    setCode("");
  }

  function backspace() {
    setCode((prev) => prev.slice(0, -1));
  }

  const handleConfirm = useCallback(async (code: string) => {
    const serviceListMenu = await checkTicket(code || "");
    if (serviceListMenu.ERRO) {
      setError(serviceListMenu.MSG_ERRO);
      return;
    }
    setTicketValue(code);
    setDetailsTicket(serviceListMenu);
    router.push("/ConfirmPaymentPage");
  }, []);

  return (
    <div className="min-h-screen bg-background-isChecking flex items-center justify-center px-4">
      {error && (
        <Alert
          message={error}
          onClose={() => setError(null)}
          autoHideMs={4000}
        />
      )}
      <div className="w-full max-w-4xl">
        <header className="pb-8 mt-[-50px]">
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
          <header className="text-center mb-6">
            <p className="text-background-brand font-semibold text-lg">
              Atendimento Paineiras
            </p>

            <h1 className="text-3xl font-semibold text-gray-900 mt-2">
              Digite o código do tíquete
            </h1>
          </header>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col">
              <div className="border rounded-xl p-6 h-40 flex flex-col justify-between">
                <span className="text-gray-500 text-sm">Código do tíquete</span>

                <span className="text-2xl font-semibold text-background-brand tracking-widest">
                  {code || "—"}
                </span>

                <span className="text-gray-400 text-sm">
                  {code.length} de 14 dígitos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={clear}
                  className="h-11 rounded-lg border text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Limpar
                </button>

                <button
                  onClick={backspace}
                  className="h-11 rounded-lg border text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Apagar
                </button>
              </div>

              <p className="text-sm text-gray-400 mt-5">
                Se não souber o código, peça ajuda na Central de Atendimento.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => addDigit(String(n))}
                  className="h-14 rounded-xl bg-white shadow border text-xl text-black font-semibold hover:bg-pink-50 transition"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => router.back()}
                className="col-span-1 h-14 rounded-xl border text-gray-700 font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>

              <button
                onClick={() => addDigit("0")}
                className="h-14 rounded-xl bg-white shadow border text-xl text-black font-semibold hover:bg-pink-50 transition"
              >
                0
              </button>

              <button
                disabled={!code.length}
                onClick={() => handleConfirm(code)}
                className={`
    col-span-1 h-14 rounded-xl font-semibold shadow transition
    ${
      code.length
        ? "bg-background-brand text-white hover:bg-pink-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
              >
                Confirmar
              </button>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm mt-8">
            Totem de Autoatendimento • Estacionamento
          </div>
        </div>
      </div>
    </div>
  );
}
