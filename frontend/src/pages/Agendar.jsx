import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarServicos } from "../api/servicos.js";
import { marcarServico } from "../api/agendamentos.js";
import { ErroApi } from "../api/client.js";
import "./FormPage.css";

function hojeISO() {
  const hoje = new Date();
  const offset = hoje.getTimezoneOffset();
  const ajustada = new Date(hoje.getTime() - offset * 60 * 1000);
  return ajustada.toISOString().slice(0, 10);
}

export function Agendar() {
  const navegar = useNavigate();

  const [servicos, setServicos] = useState([]);
  const [servicoId, setServicoId] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [erro, setErro] = useState("");
  const [carregandoServicos, setCarregandoServicos] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarServicos()
      .then((dados) => {
        setServicos(dados);
        if (dados.length > 0) setServicoId(String(dados[0].id));
      })
      .catch(() => setErro("Não foi possível carregar os serviços agora."))
      .finally(() => setCarregandoServicos(false));
  }, []);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    try {
      await marcarServico({
        servico_id: Number(servicoId),
        data_agendamento: data,
        hora_agendamento: hora
      });
      navegar("/pagamento-confirmado");
    } catch (erroCapturado) {
      setErro(erroCapturado instanceof ErroApi ? erroCapturado.message : "Não foi possível agendar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-formulario">
      <div className="cartao pagina-formulario__cartao">
        <h1>Agendar horário</h1>
        <p className="pagina-formulario__subtitulo">Escolha o serviço, a data e o horário desejados.</p>

        {erro && <p className="mensagem-erro">{erro}</p>}

        {carregandoServicos ? (
          <p>Carregando serviços...</p>
        ) : (
          <form onSubmit={aoEnviar}>
            <div className="campo">
              <label htmlFor="servico">Serviço</label>
              <select id="servico" value={servicoId} onChange={(e) => setServicoId(e.target.value)} required>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="data">Data</label>
              <input
                id="data"
                type="date"
                min={hojeISO()}
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="hora">Hora</label>
              <input id="hora" type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primario" disabled={enviando || servicos.length === 0}>
              {enviando ? "Agendando..." : "Confirmar agendamento"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
