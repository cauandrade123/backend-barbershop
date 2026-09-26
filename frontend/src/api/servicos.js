import { requisitar } from "./client.js";

export function listarServicos() {
  return requisitar("/servicos");
}

export function adicionarServico({ nome, preco }) {
  return requisitar("/adicionarservico", {
    method: "POST",
    autenticado: true,
    body: { nome, preco }
  });
}
