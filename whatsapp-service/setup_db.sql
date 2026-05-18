CREATE TABLE IF NOT EXISTS whatsapp_conversaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(150) NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'menu',
  contexto JSON NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW(),
  INDEX idx_estado (estado),
  INDEX idx_updated (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS whatsapp_mensajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(50) NOT NULL,
  direccion ENUM('entrante','saliente') NOT NULL,
  tipo VARCHAR(30) NOT NULL DEFAULT 'text',
  contenido TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  INDEX idx_phone (phone),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
