const formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ServiceCard({ servico, acao }) {
  return (
    <article className="cartao servico-card">
      <h3>{servico.nome}</h3>
      <p className="servico-card__preco">{formatoMoeda.format(servico.preco)}</p>
      {acao}
    </article>
  );
}
