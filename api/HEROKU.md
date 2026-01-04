# Deploy no Heroku (API)

## 1. Configuração inicial
1. Crie um app no Heroku (Dashboard ➜ New ➜ Create new app) com o nome desejado.
2. No terminal, aponte o `git` para o repositório da API (`api/`):
   ```bash
   cd api
   git remote add heroku https://git.heroku.com/<nome-do-app>.git
   ```
   Se já existir um remote `heroku`, atualize com `git remote set-url heroku https://git.heroku.com/<nome-do-app>.git`.
3. Garanta que o `Procfile` especifica o comando `web: npm run start` (já incluído) e que o `package.json` define `build` e `start` corretamente (`npm run build` compila, `npm run start` executa `dist/server.js`).

## 2. Variáveis de ambiente no Heroku
No painel do app, defina as seguintes config vars (Settings ➜ Config Vars):
- `NODE_ENV=production`
- `PORT=4000` (opcional, Heroku define, mas manter um padrão ajuda localmente)
- `JWT_SECRET` (mesmo valor usado em dev)
- `JWT_EXPIRES_IN` (ex: `24h`)
- `CORS_ORIGIN=https://<frontend>.vercel.app` (adicione qualquer domínio autorizado)
- `TURSO_DATABASE_URL=libsql://...`
- `TURSO_AUTH_TOKEN=<token>`

Heroku também exportará `DATABASE_URL` (que você não usa), mas os valores acima alimentam `config.ts` e permitem que o middleware `cors()` libere o tráfego do frontend.

## 3. Migrations e dados
1. Rode localmente as migrations para manter o departamento do TypeORM atualizado:
   ```bash
   NODE_ENV=development npm run typeorm:migration:run
   ```
2. Copie os comandos SQL gerados (`src/database/migrations/*.ts` ou `dist/database/migrations/*.js`) e execute no Turso:
   ```bash
   turso db execute --database <nome> --file migrations/latest.sql
   ```
3. Insira uma linha manual na tabela `migrations` do Turso para sincronizar o histórico (use `turso db shell` se preferir).

## 4. Deploy
1. Commit + push normalmente (`git add .`, `git commit`, `git push origin main`).
2. Envie para o Heroku:
   ```bash
   git push heroku main
   ```
   O Heroku vai rodar `npm install`, `npm run build`, depois `npm run start` via `Procfile`.
3. Aperte `heroku logs --tail` se precisar debugar.

## 5. Frontend
Atualize `VITE_API_URL` no projeto do frontend (Vercel) para apontar para `https://<heroku-app>.herokuapp.com/api`. Garanta que o frontend use esse domínio nos requests e que o backend permita via `CORS_ORIGIN`.

## Observações finais
- Quando precisar aplicar uma nova migration, repita o passo 3 antes de fazer deploy. O Heroku não roda migrations automaticamente no Turso.
- Se preferir, configure GitHub + Heroku Pipeline para deploy automático a cada push na branch `main`.
