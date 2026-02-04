'use client';

import { useState, useEffect } from 'react';
import { checkServiceAlive } from '../src/services';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      // First check navigator.onLine
      if (!navigator.onLine) {
        setIsConnected(false);
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
        setIsConnected(false);
        setIsChecking(false);
        return;
      }

      // Now call the service check
      const serviceAlive = await checkServiceAlive();
      if (serviceAlive) {
        setIsConnected(true);
      } else {
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
                backgroundColor: '#DA1984',
                animation: 'loadingBar 2s ease-in-out infinite'
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

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Sem conexão com a internet</h2>
          <p className="text-gray-700 mb-6">Verifique sua conexão e tente novamente.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#DA1984] text-white font-medium rounded hover:bg-[#c01776] transition-colors"
          >
            Tentar novamente
          </button>
        </div>
        
        <div className="py-8">
          <p className="text-center text-lg text-gray-800">
            Clube Paineiras do Morumby
          </p>
        </div>
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Serviço indisponível</h2>
          <p className="text-gray-700 mb-6">Não foi possível conectar ao serviço. Tente novamente mais tarde.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#DA1984] text-white font-medium rounded hover:bg-[#c01776] transition-colors"
          >
            Tentar novamente
          </button>
        </div>
        
        <div className="py-8">
          <p className="text-center text-lg text-gray-800">
            Clube Paineiras do Morumby
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}