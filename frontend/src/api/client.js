const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const CHAVE_AUTH = "barbearia_auth";

export function lerAuth() {
  try {
    const bruto = localStorage.getItem(CHAVE_AUTH);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

export function salvarAuth(auth) {
  localStorage.setItem(CHAVE_AUTH, JSON.stringify(auth));
}

export function limparAuth() {
  localStorage.removeItem(CHAVE_AUTH);
}

class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

export async function requisitar(caminho, { method = "GET", body, autenticado = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (autenticado) {
    const auth = lerAuth();
    if (auth?.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let dados = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = { mensagem: texto };
    }
  }

  if (!resposta.ok) {
    if (resposta.status === 401 && autenticado) {
      limparAuth();
    }
    const mensagem = dados?.erro || dados?.message || dados?.mensagem || "Erro inesperado. Tente novamente.";
    throw new ErroApi(mensagem, resposta.status);
  }

  return dados;
}

export { ErroApi };
