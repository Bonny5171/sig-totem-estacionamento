import { env } from '../../src/config/env';
import { httpClient } from './httpClient';

// Função para obter IP público
const getPublicIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return '127.0.0.1'; // IP padrão em caso de falha
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

    // Assumindo que a resposta contém uma CHAVE
    // Você pode precisar ajustar isso baseado na estrutura real da resposta da API
    if (response && response[0].CHAVE) {
      return response[0].CHAVE;
    }

    // Se não conseguir extrair a CHAVE, retorna null
    return null;
  } catch (error) {
    console.error('Erro auth:', error);
    return null;
  }
};

export const listMenu = async (chave: string): Promise<boolean> => {
  try {
    await httpClient('/api/proxy/Stones.asmx/MenuTotem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        CHAVE: chave
      }).toString(),
    });

    return true;
  } catch (error) {
    console.error('Erro auth:', error);
    return false;
  }
};


