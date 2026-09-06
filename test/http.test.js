import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/app.js";

let servidor;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    servidor = app.listen(0, "127.0.0.1", () => {
      const { port } = servidor.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => servidor.close((error) => error ? reject(error) : resolve()));
});

test("a confirmação de pagamento sempre encerra a resposta", async () => {
  const resposta = await fetch(`${baseUrl}/deucerto`);

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { mensagem: "Pagamento confirmado" });
});

test("rotas inexistentes retornam JSON 404", async () => {
  const resposta = await fetch(`${baseUrl}/inexistente`);

  assert.equal(resposta.status, 404);
  assert.deepEqual(await resposta.json(), { erro: "Rota não encontrada" });
});
