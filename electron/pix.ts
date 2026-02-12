// electron/pix.ts import { ipcMain } from "electron";

import { ipcMain } from "electron/main";

type PixCreateInput = {
  amount: number;           // em reais (ex 3.50)
  ticketId: string;         // id do ticket para referência
  expiresInSec?: number;    // default 300 (5 min)
};

type PixCreateOutput = {
  ok: boolean;
  error?: string;
  message?: string;
  orderId?: string;
  chargeId?: string;
  qrCode?: string;          // copia e cola
  qrCodeUrl?: string;       // url/imagem se vier 
  expiresAt?: string;
  status?: string;          // pending/paid/etc
};

type PixStatusOutput = {
  ok: boolean;
  error?: string;
  message?: string;
  orderId?: string;
  chargeId?: string;
  status?: string;          // status do order ou charge
  chargeStatus?: string;    // status do charge (recomendado)
  paid?: boolean;
  raw?: any;
};

const PAGARME_BASE = "https://api.pagar.me/core/v5";
const SECRET_KEY = process.env.PAGARME_SECRET_KEY || "";

function assertKey() {
  if (!SECRET_KEY || !SECRET_KEY.startsWith("sk_")) {
    throw new Error("PAGARME_SECRET_KEY ausente ou inválida (precisa começar com sk_)");
  }
}

function authHeader() {
  // Basic Auth: base64("sk_xxx:")
  const token = Buffer.from(`${SECRET_KEY}:`).toString("base64");
  return `Basic ${token}`;
}

function buildClubCustomer() {
  return {
    name: "Clube Paineiras do Morumby",
    type: "company",
    document: "52400207000157",
    document_type: "cnpj",
    phones: {
      home_phone: { country_code: "55", area_code: "11", number: "000000000" },
    },
    address: {
      line_1: "Av. Dr. Alberto Penteado, 605",
      line_2: "Jardim Sílvia",
      zip_code: "05678000",
      city: "São Paulo",
      state: "SP",
      country: "BR",
    },
  };
}

// Guarda pagamentos em memória (para polling)
const payments = new Map<string, {
  orderId: string;
  chargeId?: string;
  createdAt: number;
}>();

async function pagarmeFetch(path: string, options: RequestInit) {
  assertKey();

  const res = await fetch(`${PAGARME_BASE}${path}`, {
    ...options,
    headers: {
      "Authorization": authHeader(),
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }

  if (!res.ok) {
    const msg = json?.message || json?.errors?.[0]?.message || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

function moneyToCents(amountReais: number): number {
  // 3.50 => 350
  return Math.round((amountReais || 0) * 100);
}

  // Tenta extrair charge / qr_code do retorno do /orders
function extractPixInfo(orderResp: any) {
  // Estruturas variam um pouco; então fazemos "defensivo"
  const charges = orderResp?.charges || [];
  const charge = charges[0] || null;

  const lastTx = charge?.last_transaction || null;

  const qrCode = lastTx?.qr_code || lastTx?.qr_code_text || null;
  const qrCodeUrl = lastTx?.qr_code_url || lastTx?.qr_code_url_png || lastTx?.qr_code_url_jpeg || null;

  return {
    orderId: orderResp?.id || null,
    chargeId: charge?.id || null,
    orderStatus: orderResp?.status || null,
    chargeStatus: charge?.status || null,
    qrCode,
    qrCodeUrl,
    expiresAt: lastTx?.expires_at || charge?.due_at || null,
  };
}

export function registerPixIpc(mainWindowGetter: () => Electron.BrowserWindow | null) {

  ipcMain.handle("pix:create", async (_evt, input: PixCreateInput): Promise<PixCreateOutput> => {
    try {
      if (!input?.amount || input.amount <= 0) {
        return { ok: false, error: "INVALID_AMOUNT", message: "amount deve ser > 0" };
      }
      if (!input?.ticketId) {
        return { ok: false, error: "INVALID_TICKET", message: "ticketId obrigatório" };
      }

      const expiresIn = input.expiresInSec ?? 300;
      const cents = moneyToCents(input.amount);

      // Pedido PIX (POST /orders)
      const body = {
        code: `TICKET-${input.ticketId}-${Date.now()}`,
        customer: buildClubCustomer(),
        items: [
          { code: input.ticketId, description: `Ticket estacionamento ${input.ticketId}`, amount: cents, quantity: 1 }
        ],
        payments: [
          {
            payment_method: "pix",
            pix: { expires_in: expiresIn }
          }
        ],
        closed: true,
      };

      const orderResp = await pagarmeFetch("/orders", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const info = extractPixInfo(orderResp);

      if (!info.orderId) {
        return { ok: false, error: "NO_ORDER_ID", message: "Resposta sem orderId", status: "error" };
      }

      payments.set(info.orderId, {
        orderId: info.orderId,
        chargeId: info.chargeId ?? undefined,
        createdAt: Date.now(),
      });

      // Inicia polling automático para este order
      startPollingOne(info.orderId, mainWindowGetter);

      return {
        ok: true,
        orderId: info.orderId,
        chargeId: info.chargeId ?? undefined,
        qrCode: info.qrCode ?? undefined,
        qrCodeUrl: info.qrCodeUrl ?? undefined,
        expiresAt: info.expiresAt ?? undefined,
        status: info.orderStatus ?? "pending",
      };
    } catch (e: any) {
      return { ok: false, error: "CREATE_FAILED", message: e?.message || String(e) };
    }
  });

  ipcMain.handle("pix:status", async (_evt, orderId: string): Promise<PixStatusOutput> => {
    try {
      if (!orderId) return { ok: false, error: "INVALID_ORDER", message: "orderId obrigatório" };

      const orderResp = await pagarmeFetch(`/orders/${orderId}`, { method: "GET" });
      const info = extractPixInfo(orderResp);

      const chargeStatus = (info.chargeStatus || "").toLowerCase();
      const paid = chargeStatus === "paid";

      return {
        ok: true,
        orderId: info.orderId ?? orderId,
        chargeId: info.chargeId ?? undefined,
        status: info.orderStatus ?? undefined,
        chargeStatus: info.chargeStatus ?? undefined,
        paid,
        raw: orderResp,
      };
    } catch (e: any) {
      return { ok: false, error: "STATUS_FAILED", message: e?.message || String(e) };
    }
  });
}
// ===== Polling =====
const pollingTimers = new Map<string, NodeJS.Timeout>();

function startPollingOne(orderId: string, mainWindowGetter: () => Electron.BrowserWindow | null) {
  // evita duplicar
  if (pollingTimers.has(orderId)) return;

  const timer = setInterval(async () => {
    try {
      const orderResp = await pagarmeFetch(`/orders/${orderId}`, { method: "GET" });
      const info = extractPixInfo(orderResp);
      const chargeStatus = (info.chargeStatus || "").toLowerCase();

      if (chargeStatus === "paid") {
        clearInterval(timer);
        pollingTimers.delete(orderId);

        // avisa o renderer: pagou
        const win = mainWindowGetter();
        
        win?.webContents.send("pix:paid", {
          orderId,
          chargeId: info.chargeId,
          chargeStatus: info.chargeStatus,
          paidAt: new Date().toISOString(),
        });
      }

      // Se expirou/cancelou/falhou → para polling e avisa também (opcional)
      if (["failed", "canceled", "cancelled", "expired"].includes(chargeStatus)) {
        clearInterval(timer);
        pollingTimers.delete(orderId);

        const win = mainWindowGetter();

        win?.webContents.send("pix:failed", {
          orderId,
          chargeId: info.chargeId,
          chargeStatus: info.chargeStatus,
        });
      }

    } catch {
      // Em caso de erro temporário, continua tentando   
      }
  }, 1500); // 1.5s
  pollingTimers.set(orderId, timer);
}