'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
interface MenuItem {
  IDTOTEMMENU: number;
  TITULO_BOTAO: string;
  ACAO: string;
  DESCRICAO: string;
  ERRO: boolean;
  ICONE_PATH: string;
  IDERRO: number;
  MSG_ERRO: string;
  ORDEM_EXIBICAO: number;
}
interface DetailsTicket {
  DATA: string;
  TIPO: string;
  TEMPO_LIMITE: string;
  VALOR: string;
  VALIDAR: boolean;
  ERRO: boolean;
  IDERRO: number;
  MSG_ERRO: string;
}

interface AuthContextType {
  chave: string | null;
  setChave: (chave: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  listMenu: MenuItem[];
  setListMenu: (menu: MenuItem[]) => void;
  detailsTicket: DetailsTicket[];
  setDetailsTicket: (ticket: DetailsTicket[]) => void;
  ticketValue: string | null;
  setTicketValue: (ticket: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [chave, setChave] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [listMenu, setListMenu] = useState<MenuItem[]>([]);
  const [detailsTicket, setDetailsTicket] = useState<DetailsTicket[]>([]);
  const [ticketValue, setTicketValue] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        chave,
        setChave,
        isAuthenticated,
        setIsAuthenticated,
        listMenu,
        setListMenu,
        detailsTicket,
        setDetailsTicket,
        ticketValue,
        setTicketValue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};