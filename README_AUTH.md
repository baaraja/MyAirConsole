# Système d'Authentification avec Next.js, Server Actions, tRPC et PostgreSQL

Ce projet implémente un système d'authentification complet utilisant les technologies modernes de Next.js 15.

## 🚀 Technologies utilisées

- **Next.js 15** avec App Router
- **NextAuth.js v5** pour l'authentification OAuth et sessions
- **Prisma** comme ORM pour la base de données
- **Google OAuth** pour la connexion sociale
- **tRPC** pour l'API typée
- **PostgreSQL** comme base de données
- **bcryptjs** pour le hachage des mots de passe
- **Zod** pour la validation des schémas
- **Tailwind CSS** pour le styling
- **TypeScript** pour la sécurité des types

## 📋 Prérequis

1. **Node.js** (version 18 ou supérieure)
2. **Bun** (gestionnaire de paquets)
3. **PostgreSQL** (version 12 ou supérieure)

## ⚙️ Configuration

### 1. Installation des dépendances

```bash
bun install
```

### 2. Configuration de la base de données

1. La base de données utilise Prisma ORM avec PostgreSQL
2. Le schéma est défini dans `prisma/schema.prisma`
3. Appliquez le schéma à votre base de données :

```bash
# Pousser le schéma vers la base de données
bun run db:push

# Ou créer et appliquer une migration
bun run db:migrate

# Générer le client Prisma (automatique après push/migrate)
bun run db:generate
```

### 3. Configuration Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ 
4. Créez des identifiants OAuth 2.0
5. Ajoutez les URLs autorisées :
   - URLs JavaScript autorisées: `http://localhost:3000`
   - URLs de redirection autorisées: `http://localhost:3000/api/auth/callback/google`

### 4. Variables d'environnement

Copiez `.env.local` et configurez vos variables :

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/survivor_db"

# Auth
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🏃‍♂️ Démarrage

```bash
bun dev
```

L'application sera accessible sur http://localhost:3000

## 📂 Structure du projet

```
application/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # Routes NextAuth
│   │   │   └── signup/route.ts         # API inscription
│   │   └── trpc/[trpc]/route.ts        # Routes API tRPC
│   ├── auth/page.tsx                   # Page d'authentification unifiée
│   ├── dashboard/page.tsx              # Dashboard (après connexion)
│   └── layout.tsx                      # Layout avec providers
├── components/
│   ├── AuthForm.tsx                    # Formulaire d'auth avec Google OAuth
│   └── AuthProvider.tsx                # Provider NextAuth
├── lib/
│   ├── auth.ts                         # Configuration NextAuth v5
│   ├── prisma.ts                       # Client Prisma
│   ├── schemas.ts                      # Schémas Zod pour validation
│   ├── trpc.ts                         # Configuration tRPC de base
│   ├── client/trpc.tsx                 # Provider tRPC client
│   └── server/router.ts                # Routeurs tRPC serveur (queries uniquement)
├── prisma/
│   └── schema.prisma                   # Schéma de base de données Prisma
├── types/
│   └── next-auth.d.ts                  # Types NextAuth
└── database/
    └── init.sql                        # Script d'initialisation DB
```

## 🔐 Fonctionnalités d'authentification

### Google OAuth
- ✅ Connexion avec Google
- ✅ Gestion automatique des profils
- ✅ Sessions sécurisées avec NextAuth.js v5
- ✅ Stockage en base de données via Prisma

### Authentification Email/Password
- ✅ Inscription avec validation
- ✅ Connexion avec validation
- ✅ Hachage sécurisé des mots de passe avec bcrypt
- ✅ Gestion via NextAuth.js et API routes avec Prisma

### tRPC
- ✅ API typée pour les statistiques utilisateurs
- ✅ Queries sécurisées avec Prisma ORM
- ✅ Validation côté serveur avec Zod (pour les APIs utilitaires)

### Interface utilisateur
- ✅ Formulaire d'authentification unifié
- ✅ Bouton de connexion Google
- ✅ Basculement inscription/connexion
- ✅ Gestion des états de chargement
- ✅ Affichage des erreurs
- ✅ Design responsive avec Tailwind CSS
- ✅ Dashboard avec statistiques tRPC

## 🔄 Flux d'authentification

### Option 1: Google OAuth
1. Clic sur "Continuer avec Google"
2. Redirection vers Google
3. Autorisation et retour sur l'application
4. Création automatique du compte si inexistant
5. Redirection vers `/dashboard`

### Option 2: Email/Mot de passe
1. **Inscription** : `/auth`
   - Basculer vers "S'inscrire"
   - Validation du formulaire avec Zod
   - Vérification de l'unicité de l'email
   - Hachage du mot de passe avec bcrypt
   - Insertion en base de données
   - Connexion automatique

2. **Connexion** : `/auth`
   - Basculer vers "Se connecter"
   - Validation des identifiants via NextAuth
   - Vérification du mot de passe
   - Création de session
   - Redirection vers `/dashboard`

## 🛠️ Prochaines étapes

- [ ] Middleware d'authentification pour les routes protégées
- [ ] Système de rôles utilisateurs
- [ ] Récupération de mot de passe
- [ ] Vérification email
- [ ] Optimisation des performances des requêtes
- [ ] Tests unitaires et d'intégration

## 📝 Notes de développement

- NextAuth.js v5 gère automatiquement les sessions et cookies
- Google OAuth nécessite une configuration dans Google Cloud Console  
- L'inscription email/password utilise une API route dédiée avec Prisma
- NextAuth avec CredentialsProvider gère la connexion email/password
- Prisma ORM fournit une interface typée pour la base de données
- tRPC fournit une API typée pour les statistiques et données utilisateurs
- La validation est effectuée avec Zod côté client ET serveur (API routes)
- PostgreSQL assure la persistance des données avec les tables NextAuth via Prisma
- Tailwind CSS permet un styling rapide et responsive
- Les Server Actions obsolètes ont été supprimées au profit de NextAuth.js + Prisma

## 🎯 Commandes utiles

```bash
# Développement
bun dev                 # Démarrer le serveur de développement

# Base de données
bun run db:push         # Pousser le schéma vers la base de données
bun run db:generate     # Générer le client Prisma
bun run db:migrate      # Créer et appliquer une migration
bun run db:studio       # Ouvrir Prisma Studio (interface graphique)
```

## 🚀 URLs importantes

- `/` : Page d'accueil
- `/auth` : Page d'authentification unifiée (recommandé)
- `/dashboard` : Dashboard utilisateur (protégé)
- `/api/auth/*` : Endpoints NextAuth.js
- `/api/trpc/*` : Endpoints tRPC
