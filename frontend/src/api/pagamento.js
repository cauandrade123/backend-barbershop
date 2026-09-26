import { requisitar } from "./client.js";

export function confirmarPagamento() {
  return requisitar("/deucerto");
}
