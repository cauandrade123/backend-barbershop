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

test("o liveness responde sem depender do banco", async () => {
  const resposta = await fetch(`${baseUrl}/health`);

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), { status: "ok" });
});

test("as respostas trazem os headers de segurança do helmet", async () => {
  const resposta = await fetch(`${baseUrl}/health`);

  assert.equal(resposta.headers.get("x-content-type-options"), "nosniff");
  assert.equal(resposta.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.equal(resposta.headers.get("x-powered-by"), null);
});

test("o login bloqueia após exceder o limite de tentativas", async () => {
  const tentativa = () => fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    // Corpo inválido: barra na validação, antes de qualquer acesso ao banco.
    body: JSON.stringify({ email: "nao-e-email", senha: "" })
  });

  const respostas = [];
  for (let i = 0; i < 11; i++) {
    respostas.push(await tentativa());
  }

  assert.equal(respostas[0].status, 400);
  assert.equal(respostas.at(-1).status, 429);
  assert.deepEqual(await respostas.at(-1).json(), {
    erro: "Muitas tentativas de login. Tente novamente em alguns minutos."
  });
});
