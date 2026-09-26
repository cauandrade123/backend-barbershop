# backend-barbershop

API de agendamento para barbearia, em Node.js, Express e MySQL.

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

A API valida a configuração e testa a conexão com o banco antes de aceitar requisições: se faltar variável obrigatória ou o banco estiver fora, o processo falha na largada em vez de subir quebrado.

### Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `DB_HOST` | sim | | Host do MySQL (aceita `HOST` por compatibilidade) |
| `DB_USER` | sim | | Usuário do banco |
| `DB_NAME` | sim | | Nome do banco |
| `DB_PWD` | sim | | Senha do banco |
| `JWT_SECRET` | sim | | Segredo de assinatura do token |
| `PORT` | não | `3000` | Porta da API (aceita `PORTA`) |
| `JWT_EXPIRES_IN` | não | `8h` | Validade do token |
| `TIMEZONE` | não | `America/Sao_Paulo` | Fuso do negócio, usado para decidir o que é "hoje" |
| `CORS_ORIGINS` | não | vazio | Origens permitidas, separadas por vírgula. Vazio libera todas |
| `BCRYPT_ROUNDS` | não | `12` | Custo do hash de senha (10 a 15) |
| `LOG_LEVEL` | não | `info` | `fatal`, `error`, `warn`, `info`, `debug` ou `trace` |
| `TRUST_PROXY` | não | `1` | Camadas de proxy à frente da API |

## Operação

| Rota | Uso |
|---|---|
| `GET /health` | Liveness. Não consulta o banco, para que uma queda do MySQL não reinicie instâncias saudáveis |
| `GET /ready` | Readiness. Retorna 503 se o banco estiver inacessível |

Os logs saem em JSON estruturado (pino), com id de request para correlação. Cabeçalhos de autenticação e senhas são redigidos antes de chegar ao log.

A API trata `SIGTERM` e `SIGINT`: para de aceitar conexões, finaliza as requisições em andamento, fecha o pool do banco e sai. Se isso não concluir em 10 segundos, o processo sai à força.

## Segurança

- Senhas com hash bcrypt, custo configurável.
- Cabeçalhos de segurança via helmet.
- Rate limit em `/login` (10 tentativas por 15 min) e `/cadastro` (5 por hora), por IP.
- Papel de administrador é relido do banco a cada requisição, e não confiado ao conteúdo do token.
- Todas as queries são parametrizadas.

## Valores monetários

Preços trafegam como string decimal (`"45.00"`), não como número. Converter `DECIMAL` para o `Number` do JavaScript transforma dinheiro em ponto flutuante binário, onde `0.10 + 0.20 !== 0.30`.

## Testes

Execute `npm test` para rodar os testes de validação e das rotas. Eles não precisam de banco.


## Frontend

A pasta `frontend/` tem uma SPA em React + Vite que consome esta API (cadastro,
login, listagem de serviços, agendamento, remarcação e um painel admin). Para
rodar:

1. `cd frontend && npm install`.
2. Copie `frontend/.env.example` para `frontend/.env` e ajuste `VITE_API_URL`
   se a API não estiver em `http://localhost:3000`.
3. `npm run dev` (com a API rodando em paralelo).

Veja `frontend/README.md` para mais detalhes.
