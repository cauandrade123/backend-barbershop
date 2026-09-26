import assert from "node:assert/strict";
import test from "node:test";
import { marcarServico, remarcarAgendamento } from "../src/services/agendamentoService.js";
import {
  validarCadastro,
  validarLogin,
  validarNovoAgendamento,
  validarServico
} from "../src/utils/validation.js";

test("valida e normaliza um cadastro", () => {
  assert.deepEqual(
    validarCadastro({
      nome: "  Ana Silva  ",
      email: "ANA@EXAMPLE.COM",
      telefone: "(11) 99999-9999",
      senha: "segredo-seguro"
    }),
    {
      nome: "Ana Silva",
      email: "ana@example.com",
      telefone: "11999999999",
      senha: "segredo-seguro"
    }
  );
});

test("rejeita credenciais e serviços inválidos", () => {
  assert.throws(() => validarLogin({ email: "ana@example.com" }), { statusCode: 400 });
  assert.throws(() => validarServico({ nome: "Corte", preco: 0 }), { statusCode: 400 });
});

test("rejeita agendamento em data passada", () => {
  assert.throws(
    () => validarNovoAgendamento({ servico_id: 1, data_agendamento: "2020-01-01", hora_agendamento: "10:00" }),
    { statusCode: 400 }
  );
});

test("aceita agendamento no dia de hoje segundo o fuso da barbearia", () => {
  // Com o servidor em UTC e a loja em São Paulo, usar o fuso do processo faria
  // o dia virar às 21h e rejeitar esta data indevidamente.
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const valor = (tipo) => partes.find((parte) => parte.type === tipo).value;
  const hoje = `${valor("year")}-${valor("month")}-${valor("day")}`;

  assert.deepEqual(
    validarNovoAgendamento({ servico_id: 1, data_agendamento: hoje, hora_agendamento: "10:00" }),
    { servico_id: 1, data_agendamento: hoje, hora_agendamento: "10:00" }
  );
});

test("preço é normalizado como string decimal, nunca como float", () => {
  const servico = validarServico({ nome: "Corte", preco: 45.9 });

  assert.equal(servico.preco, "45.90");
  assert.equal(typeof servico.preco, "string");
});

test("serviços não consultam o banco quando a entrada é inválida", async () => {
  await assert.rejects(
    () => marcarServico(1, "invalido", "2030-01-01", "10:00"),
    { statusCode: 400 }
  );
  await assert.rejects(
    () => remarcarAgendamento("invalido", 1, "2030-01-01", "10:00"),
    { statusCode: 400 }
  );
});
