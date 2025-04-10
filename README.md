# MoovieBooker

MoovieBooker est une application full-stack de réservation de films qui permet aux utilisateurs de parcourir des films, rechercher des titres spécifiques, créer des comptes et effectuer des réservations. L'application est construite avec NestJS pour le backend et React pour le frontend.

## 🎬 Démo en ligne

- **Frontend (Netlify):** [https://delicate-dragon-088616.netlify.app/](https://delicate-dragon-088616.netlify.app/)
- **Frontend (Render):** [http://mooviebooker-1.onrender.com/](http://mooviebooker-1.onrender.com/)
- **Backend (Render):** [https://mooviebooker.onrender.com/](https://mooviebooker.onrender.com/)
- **Documentation API (Swagger):** [https://mooviebooker.onrender.com/api](https://mooviebooker.onrender.com/api)

## ✨ Fonctionnalités

- **Navigation de films:** Visualisation des films populaires, les mieux notés et actuellement à l'affiche
- **Recherche:** Trouvez des films par titre
- **Détails des films:** Consultez des informations complètes sur chaque film
- **Authentification:** Inscription et connexion utilisant l'authentification JWT
- **Système de réservation:** Les utilisateurs authentifiés peuvent réserver des films
- **Design responsive:** Fonctionne sur mobile, tablette et ordinateur de bureau

## 🛠️ Technologies utilisées

### Backend

- **Framework:** [NestJS](https://nestjs.com/)
- **Base de données:** PostgreSQL
- **Authentification:** JWT (JSON Web Tokens)
- **Intégration API:** API TMDB pour les données de films
- **Documentation:** Swagger/OpenAPI

### Frontend

- **Framework:** [React](https://reactjs.org/) avec [Vite](https://vitejs.dev/)
- **Style:** [Tailwind CSS](https://tailwindcss.com/) avec bibliothèque de composants
- **Gestion d'état:** React Context API
- **Routage:** React Router
- **Client HTTP:** Fetch API

## 🔧 Installation locale

### Prérequis

- Node.js
- Docker
- Clé API TMDB

### Configuration du Backend

1. Clonez le dépôt
2. Accédez au répertoire backend:
   ```bash
   cd mooviebooker-back
   ```
3. Installez les dépendances:
   ```bash
   npm install
   ```
4. Créez un fichier `.env` basé sur `.env.example` et ajoutez votre configuration:
   ```
    PORT=3000
    JWT_SECRET=secret
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=moovieBooker
    TMDB_API_KEY=your-api-key
   ```
5. Démarrez le serveur de développement:
   ```bash
   npm run start:dev
   ```

### Configuration du Frontend

1. Accédez au répertoire frontend:
   ```bash
   cd mooviebooker-front
   ```
2. Installez les dépendances:
   ```bash
   npm install
   ```
3. Créez un fichier `.env` basé sur `.env.example`:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. Démarrez le serveur de développement:
   ```bash
   npm run dev
   ```

### Configuration de la base de données

Utilisez le fichier Docker Compose inclus pour démarrer une instance PostgreSQL:

```bash
docker-compose up --build
```

## 📚 Points d'API

La documentation de l'API est disponible via Swagger à `/api` lorsque le backend est en cours d'exécution.

Points d'accès principaux:

- **Authentification:**
  - `/auth/register` - Inscription utilisateur
  - `/auth/login` - Connexion utilisateur
- **Films:**

  - `/movies` - Obtenir la liste des films avec des paramètres optionnels de recherche et de tri
  - `/movies/:id` - Obtenir des informations détaillées sur un film spécifique

- **Réservations:**
  - `/reservation` - Créer et récupérer les réservations de l'utilisateur
  - `/reservation/:id` - Obtenir ou supprimer une réservation spécifique

## 📱 Utilisation

1. Parcourez la page d'accueil pour voir les films en vedette et populaires
2. Utilisez la barre de recherche pour trouver des films spécifiques
3. Inscrivez-vous ou connectez-vous à un compte
4. Consultez les détails des films et effectuez des réservations
5. Gérez vos réservations dans le tableau de bord utilisateur

## 🚀 Déploiement

L'application est déployée sur:

- **Frontend:** Netlify et Render
- **Backend:** Render

## 📝 Notes

- Les données des films proviennent de [l'API The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)
- L'authentification est gérée via des tokens JWT
