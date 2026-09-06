# backend-barbershop
A web api using nodeJS, mysql, docker, aws, and gateway of payment

## Execução

1. Copie `.env.example` para `.env` e preencha as credenciais do MySQL e o segredo JWT.
2. Instale as dependências com `npm install`.
3. Inicie a API com `npm start`.

Variáveis obrigatórias: `DB_HOST` (ou `HOST` para compatibilidade), `DB_USER`, `DB_NAME`, `DB_PWD` e `JWT_SECRET`. A API testa a conexão com o banco antes de começar a aceitar requisições.

## Testes

Execute `npm test` para rodar os testes de validação e das rotas sem banco de dados.
