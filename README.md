This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Netlify

Projekt korzysta z oficjalnego adaptera OpenNext na Netlify i Node.js 24.
Konfiguracja buildu znajduje się w `netlify.toml`. Nie włączaj statycznego
eksportu, ponieważ aplikacja korzysta z SSR, API Routes i funkcji tła.

1. Zaloguj CLI i połącz katalog z projektem:

   ```bash
   npx netlify-cli@latest login
   npx netlify-cli@latest link
   ```

2. Dodaj wartości z `.env.example` w `Project configuration > Environment
   variables`. Zmienne Supabase są wymagane. Pozostałe włączają wskazane
   integracje. Sekretów nie wpisuj do `netlify.toml` i nie commituj plików
   `.env`.

3. Sprawdź preview, a następnie opublikuj produkcję:

   ```bash
   npx netlify-cli@latest deploy --build
   npx netlify-cli@latest deploy --build --prod
   ```

### Property image optimization

Karty na stronach wyszukiwania używają `next/image`, responsywnego `srcset`,
AVIF/WebP i jakości 70. Adapter obsługuje je przez Netlify Image CDN.
Zewnętrzne źródła przechodzą przez `/api/property-image`, który dopuszcza tylko
hosty z `lib/propertyImageSources.ts`. Po dodaniu nowego feedu jego host i
protokół trzeba dopisać do tej listy.
