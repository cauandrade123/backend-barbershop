import { requisitar } from "./client.js";

export function cadastrar({ nome, email, telefone, senha }) {
  return requisitar("/cadastro", {
    method: "POST",
    body: { nome, email, telefone, senha }
  });
}

export function login({ email, senha }) {
  return requisitar("/login", {
    method: "POST",
    body: { email, senha }
  });
}
