"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useBarcodeScanner } from "@/app/components/BarcodeScanner/hooks/useBarcodeScanner";
import { checkTicket } from "@/app/api/services/acessoService";
import { useAuth } from "@/app/contexts/AuthContext";
import Alert from "@/app/components/Alert";

export default function BarcodeScanner() {
  const router = useRouter();
  const [status, setStatus] = useState("Aguardando leitura...");
  const [error, setError] = useState<string | null>(null);
  const { setDetailsTicket, setTicketValue } = useAuth();

  const handleScan = useCallback(async (code: string) => {
    const serviceListMenu = await checkTicket(code || "");
    if (serviceListMenu.ERRO) {
      setError(serviceListMenu.MSG_ERRO);
      setStatus("Erro na leitura do código. Tente novamente.");
      return;
    }
    setStatus(`${code} ✓`);
    setTicketValue(code);
    setDetailsTicket(serviceListMenu);
    router.push("/ConfirmPaymentPage");
  }, []);

  useBarcodeScanner(handleScan);

  return (
    <div className="bg-gray-50 rounded-2xl py-10 px-10 flex flex-col items-center">
        {error && <Alert message={error} onClose={() => setError(null)} autoHideMs={4000} />}
      <p className="text-gray-600 text-xl font-medium mb-6">{status}</p>

      <div className="relative w-full max-w-3xl h-20 bg-white rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        <div className="flex gap-[3px]">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className={`h-10 ${i % 3 === 0 ? "w-[3px]" : "w-[1px]"} bg-gray-700`}
            />
          ))}
        </div>

        <div className="absolute inset-y-0 w-full flex items-center">
          <div className="h-[2px] bg-background-brand w-full animate-scan" />
        </div>
      </div>

      <p className="text-gray-500 mt-6 text-lg">
        Aponte o código para o leitor
      </p>
    </div>
  );
}
