import { setState, getCategorias, getCitasPorCategoria, getCitaDetalle } from '../store.js';
import { sendText, phone, starsDisplay } from '../utils/wa.js';

export async function showCategorias(sock, jid) {
  const cats = await getCategorias();
  if (!cats.length) {
    await sendText(sock, jid, '😔 No hay categorías disponibles por el momento. Escribe *menu* para volver.');
    return;
  }

  const lineas = cats.map((c, i) => `${i + 1}️⃣  ${c.nombre} (${c.total} citas)`).join('\n');
  await sendText(sock, jid,
    `🗂️ *Categorías de citas románticas*\n\n${lineas}\n\n` +
    `Elige una categoría o escribe *0* para volver al menú.`
  );

  await setState(phone(jid), 'categorias', {
    categoria_ids: cats.map(c => c.id),
    categoria_nombres: cats.map(c => c.nombre),
  });
}

export async function showCitasPorCategoria(sock, jid, categoriaId, nombreCat = '') {
  const citas = await getCitasPorCategoria(categoriaId, 8);
  if (!citas.length) {
    await sendText(sock, jid, '😔 No hay citas disponibles en esta categoría.');
    await showCategorias(sock, jid);
    return;
  }

  const lineas = citas.map((c, i) => `${i + 1}️⃣  *${c.nombre}*\n    📍 ${c.direccion ?? 'La Paz'}`).join('\n\n');
  await sendText(sock, jid,
    `💕 *${nombreCat || 'Citas románticas'}*\n\n${lineas}\n\n` +
    `Elige un número para ver los detalles o escribe *0* para volver al menú.`
  );

  await setState(phone(jid), 'citas_lista', {
    cita_ids: citas.map(c => c.id),
    categoria_id: categoriaId,
    categoria_nombre: nombreCat,
  });
}

export async function showCitaDetalle(sock, jid, citaId, contextoExtra = {}) {
  const cita = await getCitaDetalle(citaId);
  if (!cita) {
    await sendText(sock, jid, '❌ No encontré esa cita. Intenta de nuevo.');
    await showCategorias(sock, jid);
    return;
  }

  const estrellas = starsDisplay(cita.puntos ?? 50);
  let texto = `💕 *${cita.nombre}*\n`;
  texto += `📂 Categoría: ${cita.categoria ?? 'General'}\n`;
  texto += `⭐ Puntuación: ${estrellas} (${cita.puntos ?? 0} pts)\n\n`;

  if (cita.descripcion) {
    const desc = cita.descripcion.length > 300
      ? cita.descripcion.substring(0, 300) + '…'
      : cita.descripcion;
    texto += `📝 ${desc}\n\n`;
  }

  if (cita.direccion) texto += `📍 *Dirección:* ${cita.direccion}\n`;
  if (cita.negocio)   texto += `🏪 *Negocio:* ${cita.negocio}\n`;
  if (cita.negocio_telefono) texto += `📞 *Tel:* ${cita.negocio_telefono}\n`;

  if (cita.latitud && cita.longitud) {
    texto += `\n🗺️ https://maps.google.com/?q=${cita.latitud},${cita.longitud}\n`;
  }

  texto += `\n¿Qué deseas hacer?\n1️⃣ Ver más citas de esta categoría\n2️⃣ Ver otras categorías\n3️⃣ Volver al menú principal`;

  await sendText(sock, jid, texto);

  await setState(phone(jid), 'cita_detalle', {
    cita_id: citaId,
    categoria_id: contextoExtra.categoria_id,
    categoria_nombre: contextoExtra.categoria_nombre,
  });
}
