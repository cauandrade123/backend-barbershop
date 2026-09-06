import { createHttpError } from "./httpError.js";

function corpoValido(corpo) {
  if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
    throw createHttpError(400, "Corpo da requisição inválido");
  }
}

function textoObrigatorio(valor, campo, tamanhoMinimo, tamanhoMaximo) {
  if (typeof valor !== "string") {
    throw createHttpError(400, `${campo} é obrigatório`);
  }

  const texto = valor.trim();
  if (texto.length < tamanhoMinimo || texto.length > tamanhoMaximo) {
    throw createHttpError(400, `${campo} deve ter entre ${tamanhoMinimo} e ${tamanhoMaximo} caracteres`);
  }

  return texto;
}

function emailValido(valor) {
  const email = textoObrigatorio(valor, "Email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, "Email inválido");
  }
  return email;
}

function idPositivo(valor, campo) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError(400, `${campo} inválido`);
  }
  return id;
}

function dataEHora(dataAgendamento, horaAgendamento) {
  if (typeof dataAgendamento !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dataAgendamento)) {
    throw createHttpError(400, "Data de agendamento inválida");
  }

  const [ano, mes, dia] = dataAgendamento.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    throw createHttpError(400, "Data de agendamento inválida");
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (data < hoje) {
    throw createHttpError(400, "Não é possível agendar uma data no passado");
  }

  if (typeof horaAgendamento !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaAgendamento)) {
    throw createHttpError(400, "Hora de agendamento inválida");
  }

  return { data_agendamento: dataAgendamento, hora_agendamento: horaAgendamento };
}

export function validarCadastro(corpo) {
  corpoValido(corpo);
  const telefone = typeof corpo.telefone === "string" ? corpo.telefone.replace(/\D/g, "") : "";

  if (telefone.length < 10 || telefone.length > 15) {
    throw createHttpError(400, "Telefone inválido");
  }

  if (typeof corpo.senha !== "string" || corpo.senha.length < 8 || Buffer.byteLength(corpo.senha) > 72) {
    throw createHttpError(400, "Senha deve ter entre 8 e 72 bytes");
  }

  return {
    nome: textoObrigatorio(corpo.nome, "Nome", 2, 100),
    email: emailValido(corpo.email),
    telefone,
    senha: corpo.senha
  };
}

export function validarLogin(corpo) {
  corpoValido(corpo);

  if (typeof corpo.senha !== "string" || corpo.senha.length === 0) {
    throw createHttpError(400, "Senha é obrigatória");
  }

  return { email: emailValido(corpo.email), senha: corpo.senha };
}

export function validarServico(corpo) {
  corpoValido(corpo);
  const preco = Number(corpo.preco);

  if (!Number.isFinite(preco) || preco <= 0 || preco > 99999.99) {
    throw createHttpError(400, "Preço inválido");
  }

  return {
    nome: textoObrigatorio(corpo.nome, "Nome do serviço", 2, 100),
    preco: Number(preco.toFixed(2))
  };
}

export function validarNovoAgendamento(corpo) {
  corpoValido(corpo);
  return {
    servico_id: idPositivo(corpo.servico_id, "Serviço"),
    ...dataEHora(corpo.data_agendamento, corpo.hora_agendamento)
  };
}

export function validarRemarcacao(idAgendamento, corpo) {
  corpoValido(corpo);
  return {
    id: idPositivo(idAgendamento, "Agendamento"),
    ...dataEHora(corpo.data_agendamento, corpo.hora_agendamento)
  };
}
