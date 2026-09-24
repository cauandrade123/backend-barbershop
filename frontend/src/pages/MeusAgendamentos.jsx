import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarMeusAgendamentos, remarcarAgendamento } from "../api/agendamentos.js";
import { ErroApi } from "../api/client.js";
import { AppointmentRow } from "../components/AppointmentRow.jsx";
import "./MeusAgendamentos.css";

export function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroRemarcacao, setErroRemarcacao] = useState("");
  const [idRemarcando, setIdRemarcando] = useState(null);

  function carregar() {
    setCarregando(true);
    setErro("");
    listarMeusAgendamentos()
      .then(setAgendamentos)
      .catch(() => setErro("Não foi possível carregar seus agendamentos agora."))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function aoRemarcar(id, novaData) {
    setErroRemarcacao("");
    setIdRemarcando(id);

    try {
      await remarcarAgendamento(id, novaData);
      carregar();
      return true;
    } catch (erroCapturado) {
      setErroRemarcacao(
        erroCapturado instanceof ErroApi ? erroCapturado.message : "Não foi possível remarcar. Tente novamente."
      );
      return false;
    } finally {
      setIdRemarcando(null);
    }
  }

  return (
    <section className="container secao meus-agendamentos">
      <h1>Meus agendamentos</h1>

      {erroRemarcacao && <p className="mensagem-erro">{erroRemarcacao}</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}
      {carregando && <p>Carregando...</p>}

      {!carregando && !erro && agendamentos.length === 0 && (
        <div className="cartao meus-agendamentos__vazio">
          <p>Você ainda não tem nenhum agendamento.</p>
          <Link to="/agendar" className="btn btn-primario">
            Agendar horário
          </Link>
        </div>
      )}

      {!carregando && agendamentos.length > 0 && (
        <div className="cartao meus-agendamentos__tabela-wrapper">
          <table className="meus-agendamentos__tabela">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Preço</th>
                <th>Data e hora</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((agendamento) => (
                <AppointmentRow
                  key={agendamento.agendamento_id}
                  agendamento={agendamento}
                  onRemarcar={aoRemarcar}
                  remarcando={idRemarcando === agendamento.agendamento_id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
