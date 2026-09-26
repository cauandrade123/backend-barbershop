import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarServicos } from "../api/servicos.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ServiceCard } from "../components/ServiceCard.jsx";
import { TeamCard } from "../components/TeamCard.jsx";
import { GallerySection } from "../components/GallerySection.jsx";
import "./Home.css";

const EQUIPE = [
  { nome: "Marcos Duarte", especialidade: "Cortes clássicos e navalha", iniciais: "MD" },
  { nome: "Rafael Souza", especialidade: "Barba e acabamento", iniciais: "RS" },
  { nome: "João Pedro", especialidade: "Degradê e desenhos", iniciais: "JP" }
];

const GALERIA = ["Corte clássico", "Barba desenhada", "Ambiente", "Degradê", "Navalha", "Balcão de atendimento"];

export function Home() {
  const { estaLogado } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    listarServicos()
      .then((dados) => {
        if (ativo) setServicos(dados);
      })
      .catch(() => {
        if (ativo) setErro("Não foi possível carregar os serviços agora.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero__conteudo">
          <p className="hero__selo">Desde sempre, tradição de barbeiro</p>
          <h1>Barbearia Império</h1>
          <p className="hero__tagline">Tradição em cada corte.</p>
          <Link to={estaLogado ? "/agendar" : "/cadastro"} className="btn btn-primario btn-grande">
            Agendar horário
          </Link>
        </div>
      </section>

      <div className="faixa-navalha" aria-hidden="true" />

      <section className="container secao">
        <h2>Serviços e preços</h2>
        {carregando && <p>Carregando serviços...</p>}
        {erro && <p className="mensagem-erro">{erro}</p>}
        {!carregando && !erro && (
          <div className="servicos-grid">
            {servicos.map((servico) => (
              <ServiceCard
                key={servico.id}
                servico={servico}
                acao={
                  <Link to={estaLogado ? "/agendar" : "/login"} className="btn btn-secundario btn-pequeno">
                    Agendar
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="secao secao--escura">
        <div className="container">
          <h2>Nossa equipe</h2>
          <div className="equipe-grid">
            {EQUIPE.map((barbeiro) => (
              <TeamCard key={barbeiro.nome} barbeiro={barbeiro} />
            ))}
          </div>
        </div>
      </section>

      <section className="container secao">
        <h2>Galeria</h2>
        <GallerySection itens={GALERIA} />
      </section>

      <section className="secao secao--cta">
        <div className="container secao--cta__conteudo">
          <h2>Pronto para o próximo corte?</h2>
          <Link to={estaLogado ? "/agendar" : "/cadastro"} className="btn btn-primario btn-grande">
            Agendar agora
          </Link>
        </div>
      </section>
    </>
  );
}
