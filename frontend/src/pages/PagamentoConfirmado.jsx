import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { confirmarPagamento } from "../api/pagamento.js";
import "./FormPage.css";

export function PagamentoConfirmado() {
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    confirmarPagamento()
      .then((dados) => setMensagem(dados?.mensagem || "Pagamento confirmado"))
      .catch(() => setErro("Não foi possível confirmar o pagamento agora, mas seu horário já está reservado."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="pagina-formulario">
      <div className="cartao pagina-formulario__cartao" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }} aria-hidden="true">
          ✂️
        </div>
        <h1>Agendamento confirmado</h1>

        {carregando && <p>Confirmando pagamento...</p>}
        {!carregando && mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
        {!carregando && erro && <p className="mensagem-erro">{erro}</p>}

        <Link to="/meus-agendamentos" className="btn btn-primario">
          Ver meus agendamentos
        </Link>
      </div>
    </div>
  );
}
