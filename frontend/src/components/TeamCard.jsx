export function TeamCard({ barbeiro }) {
  return (
    <article className="cartao equipe-card">
      <div className="equipe-card__avatar" aria-hidden="true">
        {barbeiro.iniciais}
      </div>
      <h3>{barbeiro.nome}</h3>
      <p className="equipe-card__especialidade">{barbeiro.especialidade}</p>
    </article>
  );
}
