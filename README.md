# 🎨 Assistant ALSH Créatif

Outil web pour aider un **animateur ALSH (6-11 ans)** à trouver des idées
d'activités, construire ses journées, organiser ses semaines et sauvegarder ses
meilleures animations.

> Application **fonctionnelle** (pas une simple maquette). Données stockées dans
> le navigateur (`localStorage`), avec une architecture prête à être branchée
> sur **Supabase** plus tard.

---

## ✨ Fonctionnalités

- **Tableau de bord** : accès rapides + statistiques (activités, projets,
  semaines, journées).
- **Générateur d'idées** (IA simulée) : thème, âge, nombre d'enfants/animateurs,
  intérieur/extérieur, météo, type souhaité, durée → idées classées par
  catégories (artistiques, sportives, grands jeux, temps calmes, autonomes).
- **Planning journée** : créneaux fixes ALSH, ajout/modification/suppression
  d'activités, matériel, notes, export & impression.
- **Planning semaine** : lundi → vendredi avec progression pédagogique
  (découverte → création → coopération → préparation → restitution), génération
  automatique à partir d'un thème.
- **Bibliothèque** : activités sauvegardées, filtres (thème, âge, type, durée,
  lieu, difficulté), modification et suppression.
- **Fiche activité** complète et éditable (objectifs, matériel, déroulement,
  variantes, sécurité, retour animateur, note).
- **Générateur de projet pédagogique** : résumé, objectifs, planning, idées
  d'activités, finalité (exposition, spectacle, grand jeu, restitution).
- **Export** : impression, export texte, export journée / semaine / projet.
- **Design** moderne, coloré, responsive (mobile / tablette / ordinateur).

---

## 🧱 Stack technique

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **React Router 6**
- **lucide-react** (icônes)
- **JavaScript** (pas de TypeScript)

---

## 📂 Architecture du projet

```
animation/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                 # point d'entrée + Router + Provider
    ├── App.jsx                  # routes
    ├── index.css                # Tailwind + classes utilitaires (.btn, .card…)
    ├── components/              # composants réutilisables
    │   ├── Layout.jsx           # navigation (sidebar + mobile)
    │   ├── PageHeader.jsx
    │   ├── StatCard.jsx
    │   ├── ActivityCard.jsx
    │   ├── ActivityDetail.jsx   # fiche en lecture seule
    │   ├── Badge.jsx
    │   └── Modal.jsx
    ├── pages/                   # une page par fonctionnalité
    │   ├── Dashboard.jsx
    │   ├── IdeaGenerator.jsx
    │   ├── DayPlanner.jsx
    │   ├── WeekPlanner.jsx
    │   ├── Library.jsx
    │   ├── ActivitySheet.jsx
    │   └── ProjectGenerator.jsx
    ├── data/                    # données prédéfinies (thèmes, banque d'idées)
    │   ├── themes.js
    │   ├── activitiesBank.js
    │   └── timeSlots.js
    ├── context/
    │   └── AppContext.jsx       # store global + persistance
    └── utils/
        ├── storage.js          # localStorage (+ adaptateur "db" pour Supabase)
        ├── generator.js        # IA simulée (idées / semaine / projet)
        ├── export.js           # impression + export texte
        ├── planningInbox.js    # transfert d'une activité vers le planning
        └── id.js
```

---

## 🚀 Installation & lancement

Prérequis : **Node.js 18+** et **npm**.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
# → ouvrir http://localhost:5173

# 3. Build de production
npm run build

# 4. Prévisualiser le build
npm run preview
```

---

## 🤖 IA simulée → vraie API IA

Le générateur (`src/utils/generator.js`) expose trois fonctions **asynchrones** :
`generateIdeas()`, `generateWeek()`, `generateProject()`. Elles utilisent
aujourd'hui la banque locale (`src/data/activitiesBank.js`).

Pour brancher une vraie IA plus tard, il suffit de remplacer le corps de ces
fonctions par un appel `fetch` vers votre API (en conservant la même forme de
retour). Aucun composant n'a besoin d'être modifié.

## 🗄️ localStorage → Supabase

Toute la persistance passe par `src/utils/storage.js`, qui expose un adaptateur
`db` (`list`, `replaceAll`) renvoyant déjà des `Promise`. Pour migrer vers
Supabase :

1. Remplacer l'implémentation de `db` par des requêtes Supabase.
2. Adapter `AppContext.jsx` pour charger les données via `await db.list(...)`.

La structure des données (activités, journées, semaines, projets) reste
identique.

---

## 🔜 Prochaines améliorations possibles

- Authentification + multi-utilisateurs (Supabase Auth).
- Synchronisation cloud des activités/projets (Supabase Postgres).
- Vraie génération IA (Claude / API) pour des idées illimitées et personnalisées.
- Export **PDF** mis en page (au-delà de l'impression navigateur).
- Glisser-déposer des activités dans le planning.
- Partage d'un planning ou d'un projet par lien.
- Bibliothèque communautaire d'activités entre animateurs.
- Mode hors-ligne (PWA).
