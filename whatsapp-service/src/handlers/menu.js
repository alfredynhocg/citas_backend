import { setState } from '../store.js';
import { sendText, phone } from '../utils/wa.js';
import { showCategorias, showCitasPorCategoria, showCitaDetalle } from './citas.js';
import { handleSoporte } from './misc.js';

export async function sendMenu(sock, jid, nombre = null) {
  const saludo = nombre ? `¡Hola, *${nombre}*! 👋` : '¡Hola! 👋';
  await sendText(sock, jid,
    `${saludo} Bienvenido/a a *100 Citas Románticas en La Paz* 💕\n\n` +
    `¿Qué deseas hacer hoy?\n\n` +
    `1️⃣  💕 Explorar citas románticas\n` +
    `2️⃣  🗂️ Ver por categoría\n` +
    `3️⃣  ❓ ¿Qué es 100 Citas?\n` +
    `4️⃣  📞 Hablar con un asesor\n\n` +
    `Responde con el *número* de la opción o escribe lo que buscas.`
  );
  await setState(phone(jid), 'menu');
}

export async function handleNumericInput(sock, jid, text, estado, contexto) {
  const n = parseInt(text);

  if (estado === 'menu') {
    if (n === 1) { await showCategorias(sock, jid); return; }
    if (n === 2) { await showCategorias(sock, jid); return; }
    if (n === 3) { await handlePresentacion(sock, jid); return; }
    if (n === 4) { await handleSoporte(sock, jid); return; }
    await sendMenu(sock, jid);
    return;
  }

  if (estado === 'categorias') {
    const ids = contexto?.categoria_ids ?? [];
    const id = ids[n - 1];
    if (!id) {
      await sendText(sock, jid, `❌ Opción no válida. Elige un número del 1 al ${ids.length} o escribe *0* para el menú.`);
      return;
    }
    const nombre_cat = contexto?.categoria_nombres?.[n - 1] ?? '';
    await showCitasPorCategoria(sock, jid, id, nombre_cat);
    return;
  }

  if (estado === 'citas_lista') {
    const ids = contexto?.cita_ids ?? [];
    const id = ids[n - 1];
    if (!id) {
      await sendText(sock, jid, `❌ Opción no válida. Elige del 1 al ${ids.length} o *0* para el menú.`);
      return;
    }
    await showCitaDetalle(sock, jid, id, {
      categoria_id: contexto?.categoria_id,
      categoria_nombre: contexto?.categoria_nombre,
    });
    return;
  }

  if (estado === 'cita_detalle') {
    if (n === 1) {
      const catId = contexto?.categoria_id;
      const catNombre = contexto?.categoria_nombre ?? '';
      if (catId) { await showCitasPorCategoria(sock, jid, catId, catNombre); return; }
      await showCategorias(sock, jid);
      return;
    }
    if (n === 2) { await showCategorias(sock, jid); return; }
    if (n === 3) { await sendMenu(sock, jid); return; }
    await sendMenu(sock, jid);
    return;
  }

  if (estado === 'soporte') {
    await sendMenu(sock, jid);
    return;
  }

  await sendMenu(sock, jid);
}

async function handlePresentacion(sock, jid) {
  await sendText(sock, jid,
    `💕 *¿Qué es 100 Citas Románticas en La Paz?*\n\n` +
    `Es una guía de experiencias románticas únicas en la ciudad de La Paz, Bolivia. ` +
    `Desde restaurantes especiales hasta miradores, museos, naturaleza y más.\n\n` +
    `🎯 El objetivo: vivir las 100 experiencias con tu pareja y crear recuerdos inolvidables.\n\n` +
    `⭐ Cada cita tiene una puntuación y descripción detallada.\n` +
    `📍 Todas están ubicadas en La Paz y sus alrededores.\n\n` +
    `¡Descubre La Paz de una manera diferente! 🏙️💑`
  );
  await sendMenu(sock, jid);
}
