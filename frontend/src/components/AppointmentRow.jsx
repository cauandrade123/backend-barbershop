import { useState } from "react";

const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const TAG_POR_STATUS = {
  agendado: "tag-agendado",
  cancelado: "tag-cancelado",
  concluido: "tag-concluido"
};

function formatarData(data) {
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function AppointmentRow({ agendamento, onRemarcar, remarcando }) {
  const [editando, setEditando] = useState(false);
  const [novaData, setNovaData] = useState(agendamento.data_agendamento?.slice(0, 10) || "");
  const [novaHora, setNovaHora] = useState(agendamento.hora_agendamento || "");

  const podeRemarcar = agendamento.status === "agendado";

  async function confirmarRemarcacao(evento) {
    evento.preventDefault();
    const sucesso = await onRemarcar(agendamento.agendamento_id, {
      data_agendamento: novaData,
      hora_agendamento: novaHora
    });
    if (sucesso) {
      setEditando(false);
    }
  }

  return (
    <tr className="agendamento-linha">
      <td>{agendamento.nome_servico}</td>
      <td>{formatoMoeda.format(agendamento.preco_servico)}</td>
      <td>
        {editando ? (
          <form className="agendamento-linha__form" onSubmit={confirmarRemarcacao}>
            <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} required />
            <input type="time" value={novaHora} onChange={(e) => setNovaHora(e.target.value)} required />
            <button type="submit" className="btn btn-primario btn-pequeno" disabled={remarcando}>
              {remarcando ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="btn btn-secundario btn-pequeno"
              onClick={() => setEditando(false)}
              disabled={remarcando}
            >
              Cancelar
            </button>
          </form>
        ) : (
          <>
            {formatarData(agendamento.data_agendamento)} às {agendamento.hora_agendamento}
          </>
        )}
      </td>
      <td>
        <span className={`rotulo-tag ${TAG_POR_STATUS[agendamento.status] || "tag-agendado"}`}>
          {agendamento.status}
        </span>
      </td>
      <td>
        {podeRemarcar && !editando && (
          <button className="btn btn-secundario btn-pequeno" onClick={() => setEditando(true)}>
            Remarcar
          </button>
        )}
      </td>
    </tr>
  );
}
