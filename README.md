# backend-barbershop

API de agendamento para barbearia, em Node.js, Express e MySQL.

## Execução

1. Copie `.env.example` para `.env` e preencha as credenciais do MySQL e o segredo JWT.
2. Instale as dependências com `npm ci`.
3. Inicie a API com `npm start` (ou `npm run dev` para recarregar a cada alteração).

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
