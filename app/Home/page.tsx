"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@/app/components/Icons";
import { useAuth } from "@/app/contexts/AuthContext";

export default function HomeScreen() {
  const router = useRouter();
  const { listMenu } = useAuth();

  const handleNavigation = (route: string) => {
    if (route === "PAGAR_ESTACIONAMENTO") {
      return router.push("/PayForParking");
    }
    if (route === "PAGAMENTO_SEM_TICKET") {
      return router.push("/DigitTicketPage");
    }

    router.push(route);
  };

  const handlePIX = async () => {
    debugger

    const resp = await window.electronAPI.pix.create({
      amount: 3.50,
      ticketId: "19062408265501",
      expiresInSec: 300, // 5 min
    });

    if (!resp.ok) {
      alert(resp.message);
      return;
    }
  }

  return (
  <div className="min-h-screen flex flex-col bg-background-isChecking">
    <header className="w-full pt-6 pb-4 px-4">
      <div className="max-w-md mx-auto">
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

    <main className="flex-1 max-w-3xl mx-auto px-8">
      <div className="text-center mt-2 mb-10">
        <h1 className="text-3xl font-bold text-background-brand mb-2">
          Atendimento Paineiras
        </h1>
        <p className="text-xl text-typography-subTitle">
          Escolha a opção desejada
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">

        <button
            key={123456}
            onClick={() => handlePIX()}
            className="
              group flex flex-col items-center justify-center
              bg-white rounded-2xl shadow-md
              hover:shadow-lg hover:bg-background-brand hover:text-white
              active:scale-95 transition p-6 h-32
            "
          >
            {/* <Icon
              name={option.ICONE_PATH}
              className="text-typography-gray group-hover:text-white mb-[10]"
              variant="fal"
              size={60}
            /> */}
            <span className="text-gray-800 text-sm group-hover:text-white font-medium text-center leading-tight">
              PIX
            </span>
          </button>


        {listMenu.map((option) => (
          <button
            key={option.IDTOTEMMENU}
            onClick={() => handleNavigation(option.ACAO)}
            className="
              group flex flex-col items-center justify-center
              bg-white rounded-2xl shadow-md
              hover:shadow-lg hover:bg-background-brand hover:text-white
              active:scale-95 transition p-6 h-32
            "
          >
            {/* <Icon
              name={option.ICONE_PATH}
              className="text-typography-gray group-hover:text-white mb-[10]"
              variant="fal"
              size={60}
            /> */}
            <span className="text-gray-800 text-sm group-hover:text-white font-medium text-center leading-tight">
              {option.TITULO_BOTAO}
            </span>
          </button>
        ))}
      </div>
    </main>

    <footer className="py-8">
      <p className="text-center text-md text-typography-gray">
        Central de Atendimento - Totem de Autoatendimento
      </p>
    </footer>
  </div>
);

}
