# Aura Finance Backend

Monolítico em Node.js com TypeScript, Express e TypeORM preparado para suportar a SPA Aura Finance.

## Scripts

- `npm run dev` – inicia o servidor com `ts-node-dev` (recarregamento rápido).
- `npm run build` – compila o projeto para `dist/`.
- `npm run start` – executa a build compilada para produção.
- `npm run typeorm:migration:generate -- --name <nome>` – utiliza o CLI do TypeORM para gerar uma migration.
- `npm run typeorm:migration:run` – aplica migrations pendentes.
- `npm run seed` – cria um usuário inicial para desenvolvimento.

## Configuração

Copie `.env.example` para `.env` e configure as variáveis:

```dotenv
PORT=4000
JWT_SECRET=uma-chave-secreta
JWT_EXPIRES_IN=1h
DB_PATH=./data/aura-finance.sqlite
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```


o `JWT_SECRET` é obrigatório — a aplicação não inicializa sem ele.

## Estrutura relevante

- `src/app.ts` – configurações do Express (CORS, JSON, rotas, docs, middleware).
- `src/server.ts` – bootstrap do servidor e inicialização do TypeORM.
- `src/routes/` – módulos `auth` e `users` com validação + Swagger.
- `src/services/` – regras de negócio com `bcrypt`, JWT e indexados por entidades.
- `src/database/` – `data-source` com SQLite, migrations e seeds para ambiente local.
- `src/docs/swagger.ts` – documentação OpenAPI disponível em `/api-docs`.

## Documentação

Ao rodar o backend, o Swagger está disponível em `http://localhost:<PORT>/api-docs`. Ele descreve todos os esquemas (`User`, `AuthRequest`, `AuthResponse`, `ErrorResponse`) e exige o `Bearer token` para rotas protegidas.
