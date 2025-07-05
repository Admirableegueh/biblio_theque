This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Structure du projet

Mon  projet est divisé en deux parties principales : le frontend et le backend.

Frontend – biblio_theque (Next.js)
C’est la partie visible de l’application, celle que les utilisateurs utilisent dans leur navigateur.

Pages :

/Livres : page qui affiche tous les livres disponibles, avec possibilité de filtrer lorsqu'on clique sur catalogue ou explorer le catalogue.

/MesEmprunts : page réservée à l’utilisateur connecté, où il voit les livres qu’il a empruntés, la date de retour et de pouvoir donner des avis.

/admin/livres : page réservée aux administrateurs pour ajouter, modifier ou supprimer des livres, gérer les étudiants, voir l'activité de la page , afficher les emprunts et avoir une vue globale du site.

/admin/avis : page réservée aux administrateurs pour voir ou gérer les avis donnés sur les livres.

Composants :

NavBar, Footer, BookCard, etc. sont des petits blocs réutilisables dans plusieurs pages (barre de navigation, fiche livre...).

Context Auth :

On utilise un "contexte" React pour gérer l’authentification de l’utilisateur dans tout le site (savoir s’il est connecté, son rôle, etc.).