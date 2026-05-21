# 100 Citas Juntos — Frontend

Aplicación web para el reto de las 100 Citas Románticas en La Paz, Bolivia. Permite a parejas descubrir, completar y registrar sus citas románticas, seguir su progreso y compartir recuerdos.

## Stack

- **Vue 3** + TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Pinia** para estado global
- **Vue Router** para navegación
- **Axios** para comunicación con el backend

## Requisitos previos

- Node.js 18+
- Backend Flask corriendo en `http://localhost:5000`

## Configuración

```sh
npm install
```

Crea un archivo `.env.local` en la raíz con:

```env
VITE_API_URL=http://localhost:5000/api
```

## Desarrollo

```sh
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Build para producción

```sh
npm run build
```

## Type-check

```sh
npm run type-check
```

## Lint

```sh
npm run lint
```
