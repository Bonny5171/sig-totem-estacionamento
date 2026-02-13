"use client";

import { useState, useEffect } from "react";
import { checkServiceAlive, checkAuth, listMenu } from "../../api/services/acessoService";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";

export default function SplashScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const [serviceError, setServiceError] = useState(false);
  const { setListMenu } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      if (!navigator.onLine) {
        setServiceError(true);
        setIsChecking(false);
        return;
      }

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

      const serviceAlive = await checkServiceAlive();
      const serviceAuth = await checkAuth();
      const serviceListMenu = await listMenu(serviceAuth || '');

      if (!serviceAlive && !serviceAuth) {
        setServiceError(true);
      }
      setListMenu(serviceListMenu);
      setIsChecking(false);
    };

    checkConnection();
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col bg-background-isChecking">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-semibold text-black mb-4">
            Iniciando atendimento
          </h2>

          <p className="text-xl text-typography-subTitle mb-10">
            Aguarde enquanto o sistema é preparado
          </p>

          <div className="w-[40rem] h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-background-brand"
              style={{
                animation: "loadingBar 2s ease-in-out infinite",
              }}
            ></div>
          </div>
        </div>

        <div className="py-8">
          <p className="text-center text-lg text-typography-gray">
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
    <div className="flex min-h-screen flex-col bg-background-serviceError">
      <header className="w-full pt-4 pb-2 px-4">
        <div className="max-w-md mx-auto mt-[100px]">
          <div className="flex justify-center">
            <Image
              src={require("../../assets/logo.png")}
              alt="Atendimento Paineiras"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
      </header>
      
      <div className=" flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Sem conexão com o servidor
        </h2>
        <p className="text-center text-lg text-background-brand mb-3">
          Clube Paineiras do Morumby
        </p>
        <p className="text-typography-gray mb-6">
          Não foi possível se comunicar com o serviço no momento.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-60 py-2 bg-background-brand text-white font-medium rounded hover:bg-background-brand transition-colors"
        >
          Tentar novamente
        </button>
      </div>

      <div className="py-6">
        <p className="text-center text-lg text-typography-gray">
          O sistema tentará reconectar automaticamente.
        </p>
      </div>
    </div>
  );
}

  return <>{children}</>;
}
