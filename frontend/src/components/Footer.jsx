import "./Footer.css";

export function Footer() {
  return (
    <footer className="rodape">
      <div className="faixa-navalha" aria-hidden="true" />
      <div className="container rodape__conteudo">
        <div>
          <h3 className="rodape__titulo">Barbearia Império</h3>
          <p>Tradição em cada corte.</p>
        </div>
        <div>
          <p>Rua das Tesouras, 123 — Centro</p>
          <p>Seg a Sáb · 9h às 20h</p>
        </div>
        <div>
          <p>(11) 91234-5678</p>
          <p>contato@barbeariaimperio.com.br</p>
        </div>
      </div>
      <p className="rodape__copy">© {new Date().getFullYear()} Barbearia Império. Todos os direitos reservados.</p>
    </footer>
  );
}
