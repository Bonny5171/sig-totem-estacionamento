import { env } from '@/app/config/env';
import { httpClient } from './httpClient';

const getPublicIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return '127.0.0.1';
  }
};

export const checkServiceAlive = async (): Promise<boolean> => {
  try {
    await httpClient('/api/proxy/Acesso.asmx/TesteBanco', {
      method: 'GET',
    });

    return true;
  } catch (error) {
    console.error('Erro ao verificar serviço:', error);
    return false;
  }
};

export const checkAuth = async (): Promise<string | null> => {
  try {
    const ip = await getPublicIp();

    const response = await httpClient('/api/proxy/Acesso.asmx/Autenticar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        TITULO: '900000',
        SENHA: '1050789',
        IP: ip,
        TOKEN: env.NEXT_PUBLIC_TOKEN || 'Desconhecido',
        NAVEGADOR: 'Totem',
        BROWSER: " ",
        DISPOSITIVO: " ",
        VERSAO_APP: " ",
        VERSAO_OS: " ",
      }).toString(),
    });

    if (response && response[0].CHAVE) {
      return response[0].CHAVE;
    }

    return null;
  } catch (error) {
    console.error('Erro auth:', error);
    return null;
  }
};

export const listMenu = async (chave: string): Promise<boolean> => {
  try {
    const response = await httpClient('/api/proxy/Stones.asmx/MenuTotem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        CHAVE: chave
      }).toString(),
    });

    return response;
  } catch (error) {
    console.error('Erro auth:', error);
    return false;
  }
};

export const checkTicket = async (ticket: string): Promise<boolean> => {
  try {
    const response = await httpClient('/api/proxy/Financeiro.asmx/VerificarTiqueteTotem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        TIQUETE: ticket
      }).toString(),
    });

    return response[0];
  } catch (error) {
    console.error('Erro auth:', error);
    return false;
  }
};


