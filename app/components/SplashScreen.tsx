"use client";

import { useState, useEffect } from "react";
import { checkServiceAlive, checkAuth, listMenu } from "../api/services/acessoService";
import Image from "next/image";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [serviceError, setServiceError] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      // First check navigator.onLine
      if (!navigator.onLine) {
        setServiceError(true);
        setIsChecking(false);
        return;
      }

      // Try to fetch a small resource to confirm internet
      try {
        await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
        });
      } catch (error) {
        setServiceError(true);
        setIsChecking(false);
        return;
      }

      // Now call the service check
      const serviceAlive = await checkServiceAlive();
      const serviceAuth = await checkAuth();
      const serviceListMenu = await listMenu(serviceAuth || '');

      if (!serviceAlive && !serviceAuth) {
        setServiceError(true);
      }
      setIsChecking(false);
    };

    checkConnection();
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
        {/* Conteúdo principal centralizado */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          {/* Título principal */}
          <h2 className="text-3xl font-semibold text-black mb-4">
            Iniciando atendimento
          </h2>

          {/* Subtítulo */}
          <p className="text-xl text-[#333] mb-10">
            Aguarde enquanto o sistema é preparado
          </p>

          {/* Barra de carregamento - Width aumentada */}
          <div className="w-[40rem] h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: "#DA1984",
                animation: "loadingBar 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>

        {/* Rodapé - apenas o texto */}
        <div className="py-8">
          <p className="text-center text-lg text-[#999]">
            Clube Paineiras do Morumby
          </p>
        </div>

        <style jsx>{`
          @keyframes loadingBar {
            0% {
              width: 0%;
              transform: translateX(0);
            }
            50% {
              width: 100%;
              transform: translateX(0);
            }
            100% {
              width: 100%;
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (serviceError) {
  return (
    <div className="flex min-h-screen flex-col bg-[#000]">
      <header className="w-full pt-4 pb-2 px-4"> {/* Reduzido: pt-6 → pt-4, pb-4 → pb-2 */}
        <div className="max-w-md mx-auto mt-[100px]">
          <div className="flex justify-center">
            <Image
              src={require("../assets/logo.png")}
              alt="Atendimento Paineiras"
              width={200}
              height={64}
              className="object-contain"
            />
          </div>
        </div>
      </header>
      
      <div className=" flex flex-col items-center justify-center text-center px-4"> {/* Adicionado margin-top negativo */}
        <h2 className="text-2xl font-semibold text-white mb-2"> {/* Corrigido text-[#fff]-600 para text-white */}
          Sem conexão com o servidor
        </h2>
        <p className="text-center text-lg text-[#DA1984] mb-3">
          Clube Paineiras do Morumby
        </p>
        <p className="text-[#999] mb-6">
          Não foi possível se comunicar com o serviço no momento.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-60 py-2 bg-[#DA1984] text-white font-medium rounded hover:bg-[#c01776] transition-colors"
        >
          Tentar novamente
        </button>
      </div>

      <div className="py-6"> {/* Reduzido: py-8 → py-6 */}
        <p className="text-center text-lg text-[#999]">
          O sistema tentará reconectar automaticamente.
        </p>
      </div>
    </div>
  );
}

  return <>{children}</>;
}
