SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  telefone VARCHAR(15) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  isAdmin TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS servicos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  preco DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  servico_id INT NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'agendado',
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (servico_id) REFERENCES servicos(id)
);

INSERT INTO servicos (nome, preco) VALUES
  ('Corte clássico', 45.00),
  ('Barba', 35.00),
  ('Corte + Barba', 70.00);
