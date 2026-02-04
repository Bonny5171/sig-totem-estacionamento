import { env } from '../config/env';
import { httpClient } from './httpClient';

export const checkServiceAlive = async (): Promise<boolean> => {
  try {
    await httpClient(`${env.API_BASE}/TesteBanco`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    });

    return true;
  } catch (error) {
    console.error('Erro ao verificar serviço:', error);
    return false;
  }
};
