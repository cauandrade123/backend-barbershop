import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import { ErroApi } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./FormPage.css";

export function Login() {
  const { entrar } = useAuth();
  const navegar = useNavigate();
  const local = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      const resposta = await login({ email, senha });
      entrar(resposta);
      navegar(local.state?.de || "/", { replace: true });
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ErroApi ? erroCapturado.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-formulario">
      <div className="cartao pagina-formulario__cartao">
        <h1>Bem-vindo de volta</h1>
        <p className="pagina-formulario__subtitulo">Entre para agendar seu próximo horário.</p>

        {local.state?.cadastroConcluido && !erro && (
          <p className="mensagem-sucesso">Conta criada com sucesso! Faça login para continuar.</p>
        )}
        {erro && <p className="mensagem-erro">{erro}</p>}

        <form onSubmit={aoEnviar}>
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
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primario" disabled={enviando}>
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="pagina-formulario__rodape">
          Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
