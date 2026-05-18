import 'dotenv/config';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { Server as SocketIO } from 'socket.io';
import apiRouter from './routes/api.js';
import { startBot, setIo } from './bot.js';
import { testConnection } from './store.js';

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',').map(o => o.trim());

const app = express();
const httpServer = createServer(app);

const io = new SocketIO(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST'] },
});

setIo(io);

io.on('connection', (socket) => {
  console.log('[Socket.io] Cliente conectado:', socket.id);
  socket.on('disconnect', () => console.log('[Socket.io] Cliente desconectado:', socket.id));
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());
app.use('/', apiRouter);
app.get('/health', (_req, res) => res.json({ ok: true, service: '100 Citas WhatsApp Bot' }));

httpServer.listen(PORT, async () => {
  console.log(`[100 Citas Bot] Escuchando en http://localhost:${PORT}`);
  try {
    await testConnection();
  } catch (err) {
    console.error('[DB] Error al conectar:', err.message);
    process.exit(1);
  }
  console.log('[100 Citas Bot] Iniciando bot WhatsApp...');
  startBot().catch(console.error);
});
