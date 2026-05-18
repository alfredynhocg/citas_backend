import { setState } from '../store.js';
import { sendText, phone } from '../utils/wa.js';

export async function handleSoporte(sock, jid) {
  await sendText(sock, jid,
    `📞 *Atención personalizada*\n\n` +
    `Un asesor de *100 Citas Románticas en La Paz* revisará tu mensaje en breve.\n\n` +
    `Cuéntanos tu consulta y te respondemos lo antes posible. 💕`
  );
  await setState(phone(jid), 'soporte', { soporte_intentos: 0 });
}
