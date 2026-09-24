# backend-barbershop
A web api using nodeJS, mysql, docker, aws, and gateway of payment

## Execução 100% local (com Docker só para o MySQL)

1. Copie `.env.example` para `.env` e preencha `DB_PWD` e `JWT_SECRET` (os
   outros valores padrão já funcionam com o `docker-compose.yml` deste repo).
2. Suba o MySQL: `docker compose up -d`. Isso cria o container
   `barbearia-mysql`, expõe a porta `3306` e já roda `docker/init.sql`
   (cria as tabelas `clientes`, `servicos`, `agendamentos` e insere 3
   serviços de exemplo) na primeira vez que o volume é criado.
3. Confira se subiu: `docker compose ps` (deve aparecer "healthy" depois de
   alguns segundos).
4. Instale as dependências da API: `npm install`.
5. Inicie a API com `npm start` — ela testa a conexão com o banco antes de
   aceitar requisições, então só vai subir se o passo 2/3 tiver funcionado.
6. Crie um usuário pelo `POST /cadastro` (ou pelo frontend, tela de
   cadastro) e, se quiser um usuário admin, rode:
   ```
   docker compose exec mysql mysql -uroot -p"$DB_PWD" barbearia \
     -e "UPDATE clientes SET isAdmin=1 WHERE email='SEU_EMAIL_AQUI';"
   ```
   (troque `SEU_EMAIL_AQUI` pelo email que você cadastrou). Depois disso,
   faça login de novo para pegar um token com `role: "admin"`.

Para parar o banco: `docker compose down` (os dados continuam no volume).
Para apagar os dados e recomeçar do zero: `docker compose down -v`.

Variáveis obrigatórias: `DB_HOST` (ou `HOST` para compatibilidade), `DB_USER`, `DB_NAME`, `DB_PWD` e `JWT_SECRET`. A API testa a conexão com o banco antes de começar a aceitar requisições.

## Testes

Execute `npm test` para rodar os testes de validação e das rotas sem banco de dados.

## Frontend

A pasta `frontend/` tem uma SPA em React + Vite que consome esta API (cadastro,
login, listagem de serviços, agendamento, remarcação e um painel admin). Para
rodar:

1. `cd frontend && npm install`.
2. Copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`
   se a API não estiver em `http://localhost:3000`.
3. `npm run dev` (com a API rodando em paralelo).

Veja `frontend/README.md` para mais detalhes.
