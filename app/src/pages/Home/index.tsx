"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomeScreen() {
  const router = useRouter();

  const menuOptions = [
    {
      id: 1,
      title: "Pagar Estacionamento",
      route: "/pagamento/ticket",
    },
    {
      id: 2,
      title: "Pagamento sem Ticket",
      route: "/pagamento/sem-ticket",
    },
    {
      id: 3,
      title: "Pagamento Boleto",
      route: "/pagamento/boleto",
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header com Logo */}
      <header className="w-full pt-6 pb-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center">
            <Image
              src={require("../../../assets/logo.png")}
              alt="Atendimento Paineiras"
              width={200}
              height={64}
              className="object-contain"
            />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-8">
        {/* Título Principal */}
        <div className="text-center mt-2 mb-10">
          <h1 className="text-3xl font-bold text-[#DA1984] mb-2">
            Atendimento Paineiras
          </h1>
          <p className="text-xl text-[#333]">Escolha a opção desejada</p>
        </div>

        {/* Menu de Opções - EXATAMENTE como na imagem */}
        {/* Menu de Opções */}
        <div
          className="grid grid-cols-3 gap-6 mt-8
"
        >
          {menuOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleNavigation(option.route)}
              className="
        flex flex-col items-center justify-center
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-lg
        active:scale-95
        transition
        p-6
        h-32
      "
            >
              <Image
                src={`/icons/${option.id}.png`} // coloque seus ícones aqui
                alt="Icones de Menu"
                width={48}
                height={48}
                className="mb-3"
              />

              <span className="text-gray-800 text-sm font-medium text-center leading-tight">
                {option.title}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
