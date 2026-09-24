# Frontend — Barbearia Império

SPA em React + Vite que consome a API do `backend-barbershop`. Visual
clássico/vintage (preto, dourado, creme), com área pública, área de cliente
autenticado e painel administrativo.

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se a API não estiver em localhost:3000
npm run dev
```

A API precisa estar rodando em paralelo (veja o README na raiz do repo).

## Estrutura

- `src/api/` — chamadas HTTP para cada recurso da API (auth, serviços,
  agendamentos, pagamento) e o wrapper `client.js` que injeta o token JWT.
- `src/context/AuthContext.jsx` — sessão do usuário (token + role) persistida
  em `localStorage`.
- `src/components/` — Navbar, rodapé, proteção de rotas e cards reutilizáveis.
- `src/pages/` — páginas públicas (Home, Login, Cadastro), de cliente
  (Agendar, Meus agendamentos, Pagamento confirmado) e admin
  (`pages/admin/`).

## O que é dinâmico vs. estático

A API hoje não tem endpoints para "equipe" nem "galeria" — só para clientes,
serviços e agendamentos. Por isso, na Home:

- **Serviços e preços**: dinâmico, vem de `GET /servicos`.
- **Equipe** e **Galeria**: conteúdo estático (definido em `src/pages/Home.jsx`),
  já que não há tabela/endpoint pra isso no backend.
- **Agendamento, login, cadastro, meus agendamentos e painel admin**: 100%
  dinâmicos, consumindo os endpoints reais da API.

## Scripts

- `npm run dev` — servidor de desenvolvimento.
- `npm run build` — build de produção em `dist/`.
- `npm run preview` — serve o build de produção localmente.
- `npm run lint` — lint com oxlint.
