import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../api/auth.js";
import { ErroApi } from "../api/client.js";
import "./FormPage.css";

export function Cadastro() {
  const navegar = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await cadastrar({ nome, email, telefone, senha });
      navegar("/login", { state: { cadastroConcluido: true } });
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof ErroApi ? erroCapturado.message : "Não foi possível criar sua conta. Tente novamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-formulario">
      <div className="cartao pagina-formulario__cartao">
        <h1>Criar conta</h1>
        <p className="pagina-formulario__subtitulo">Cadastre-se para agendar seus horários.</p>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div className="campo">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="telefone">Telefone</label>
            <input
              id="telefone"
              type="tel"
              placeholder="(11) 91234-5678"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primario" disabled={enviando}>
            {enviando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="pagina-formulario__rodape">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
