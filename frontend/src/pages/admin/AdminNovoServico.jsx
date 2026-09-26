import { useState } from "react";
import { adicionarServico } from "../../api/servicos.js";
import { ErroApi } from "../../api/client.js";

export function AdminNovoServico() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setSucesso("");
    setEnviando(true);

    try {
      await adicionarServico({ nome, preco: Number(preco) });
      setSucesso(`Serviço "${nome}" cadastrado com sucesso.`);
      setNome("");
      setPreco("");
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof ErroApi ? erroCapturado.message : "Não foi possível cadastrar o serviço agora."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="cartao admin__novo-servico">
      <h2>Novo serviço</h2>

      {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      <form onSubmit={aoEnviar}>
        <div className="campo">
          <label htmlFor="nome-servico">Nome do serviço</label>
          <input id="nome-servico" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="campo">
          <label htmlFor="preco-servico">Preço (R$)</label>
          <input
            id="preco-servico"
            type="number"
            min="0.01"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar serviço"}
        </button>
      </form>
    </div>
  );
}
