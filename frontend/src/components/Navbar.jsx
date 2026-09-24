import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

export function Navbar() {
  const { estaLogado, ehAdmin, usuario, sair } = useAuth();
  const navegar = useNavigate();

  function encerrarSessao() {
    sair();
    navegar("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__conteudo">
        <Link to="/" className="navbar__marca">
          <span className="navbar__navalha" aria-hidden="true">
            ✂
          </span>
          Barbearia Império
        </Link>

        <nav className="navbar__links">
          <Link to="/">Início</Link>
          {estaLogado && <Link to="/meus-agendamentos">Meus agendamentos</Link>}
          {ehAdmin && <Link to="/admin">Painel admin</Link>}
        </nav>

        <div className="navbar__acoes">
          {estaLogado ? (
            <>
              <span className="navbar__usuario">Olá, {usuario?.nome?.split(" ")[0]}</span>
              <button className="btn btn-secundario" onClick={encerrarSessao}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secundario">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn btn-primario">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
