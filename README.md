This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) with [Electron Forge](https://www.electronforge.io/) integration for desktop applications.

## Getting Started

### Desenvolvimento Web (Next.js)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Desenvolvimento Electron

Para desenvolver com Electron (abre a aplicação Next.js local):

```bash
npm run electron:dev
```

Este comando inicia o servidor Next.js e o Electron simultaneamente.

### Configuração da URL Hosteada

Para usar uma URL hosteada em produção, configure a variável de ambiente `ELECTRON_HOSTED_URL` ou edite o arquivo `electron/main.ts` e altere a constante `HOSTED_URL`.

Exemplo:
```bash
ELECTRON_HOSTED_URL=https://sua-url-hosted.com npm run electron:make
```

Ou edite diretamente em `electron/main.ts`:
```typescript
const HOSTED_URL = 'https://sua-url-hosted.com';
```

### Build e Geração de Executáveis

#### Gerar executável para a plataforma atual:
```bash
npm run electron:make
```

#### Gerar executável para plataformas específicas:
```bash
# Windows
npm run electron:make:win

# macOS
npm run electron:make:mac

# Linux
npm run electron:make:linux
```

Os executáveis serão gerados na pasta `out/make/`.

### Estrutura do Projeto

- `electron/main.ts` - Processo principal do Electron
- `electron/preload.ts` - Script de preload para comunicação segura
- `forge.config.ts` - Configuração do Electron Forge
- `vite.*.config.ts` - Configurações do Vite para build do Electron

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
