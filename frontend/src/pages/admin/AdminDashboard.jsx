import { useEffect, useState } from "react";
import { listarTodosAgendamentos } from "../../api/agendamentos.js";
import { AdminNovoServico } from "./AdminNovoServico.jsx";
import "./Admin.css";

const TAG_POR_STATUS = {
  agendado: "tag-agendado",
  cancelado: "tag-cancelado",
  concluido: "tag-concluido"
};

function formatarData(data) {
  const [ano, mes, dia] = String(data).slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

export function AdminDashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarTodosAgendamentos()
      .then(setAgendamentos)
      .catch(() => setErro("Não foi possível carregar os agendamentos agora."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <section className="container secao admin">
      <h1>Painel administrativo</h1>

      <div className="admin__grid">
        <div className="cartao admin__tabela-wrapper">
          <h2>Todos os agendamentos</h2>

          {erro && <p className="mensagem-erro">{erro}</p>}
          {carregando && <p>Carregando...</p>}

          {!carregando && !erro && (
            <div className="admin__tabela-scroll">
              <table className="admin__tabela">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Data e hora</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nome_cliente}</td>
                      <td>{item.nome_servico}</td>
                      <td>
                        {formatarData(item.data_agendamento)} às {item.hora_agendamento}
                      </td>
                      <td>
                        <span className={`rotulo-tag ${TAG_POR_STATUS[item.status] || "tag-agendado"}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {agendamentos.length === 0 && (
                    <tr>
                      <td colSpan={4}>Nenhum agendamento encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AdminNovoServico />
      </div>
    </section>
  );
}
