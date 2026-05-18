import { logMensaje } from '../store.js';

export function phone(jid) {
  const [userPart, domain] = jid.split('@');
  const number = userPart.split(':')[0];
  return domain ? `${number}@${domain}` : number;
}

const TYPING_MS_PER_CHAR = 20;
const TYPING_MIN_MS      = 500;
const TYPING_MAX_MS      = 2800;

export async function sendText(sock, jid, text) {
  const delay = Math.min(Math.max(text.length * TYPING_MS_PER_CHAR, TYPING_MIN_MS), TYPING_MAX_MS);
  try {
    await sock.sendPresenceUpdate('composing', jid);
    await new Promise(r => setTimeout(r, delay));
    await sock.sendPresenceUpdate('paused', jid);
  } catch (_) {}
  await sock.sendMessage(jid, { text });
  try { await logMensaje(phone(jid), 'saliente', 'text', text); } catch (_) {}
}

export function extractText(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.message?.buttonsResponseMessage?.selectedButtonId ||
    ''
  ).trim();
}

export function starsDisplay(puntos) {
  const stars = Math.round((puntos / 100) * 5);
  return '⭐'.repeat(Math.max(1, Math.min(5, stars)));
}
