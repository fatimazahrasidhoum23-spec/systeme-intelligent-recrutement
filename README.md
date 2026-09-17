# 🎯 Plateforme ATS Intelligente de Recrutement

Application complète de gestion du recrutement (ATS – Applicant Tracking System) construite en **architecture microservices**, avec un moteur de matching intelligent CV ↔ offre basé sur du RAG et des agents spécialisés (IA générative).

> Projet de fin d'année (PFA) — architecture distribuée, polyglotte, orchestrée avec Docker.

---

## 🧠 Ce que fait le système

1. Une entreprise publie une **offre d'emploi**.
2. Les candidats postulent et déposent leur **CV**.
3. Le **Service ATS** (Python / FastAPI) parse le CV, l'indexe via RAG, puis le fait évaluer par plusieurs **agents spécialisés** (expérience, compétences, formation) qui produisent chacun un score.
4. Un **agent final (Final Scorer)** combine ces scores pondérés pour classer automatiquement les candidats par pertinence par rapport à l'offre.
5. Le système **apprend des préférences du recruteur** (HR Preference Learner) pour affiner ses futurs classements.
6. Les notifications (confirmation de candidature, résultat, convocation) sont envoyées de façon asynchrone via **RabbitMQ**.

---

## 🏗️ Architecture

```
                        ┌─────────────────────┐
                        │   Angular Frontend    │
                        └──────────┬───────────┘
                                   │
                        ┌──────────▼───────────┐
                        │   API Gateway (Nginx) │
                        └──────────┬───────────┘
              ┌────────────┬───────┼───────┬─────────────┬──────────────┐
              ▼            ▼       ▼       ▼             ▼              ▼
        AuthService   OffreRh   Service_ATS  email-service  my_project (entretiens)
         (.NET)     (Spring Boot) (FastAPI/IA)   (.NET)        (Symfony/PHP)
              │            │       │       │             │              │
              └────────────┴───────┴───┬───┴─────────────┴──────────────┘
                                        ▼
                              RabbitMQ (message broker)
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
             postgres-auth       postgres-offre       postgres-email
             postgres-symfony         MinIO (stockage CVs)
```

Chaque service est **indépendant, dockerisé, et possède sa propre base de données** (pattern *Database per Service*). La communication asynchrone entre services passe par **RabbitMQ** ; la communication synchrone passe par API REST à travers la gateway Nginx.

---

## ⚙️ Stack technique

| Service | Rôle | Technologies |
|---|---|---|
| **Auth_Front** | Interface utilisateur | Angular, TypeScript |
| **nginx** | API Gateway / reverse proxy | Nginx |
| **AuthService** | Authentification, gestion des comptes, JWT | .NET / C#, Entity Framework, PostgreSQL |
| **OffreRh** | Gestion des offres d'emploi | Java, Spring Boot, Maven, PostgreSQL |
| **Service_ATS** | 🧠 Moteur de matching intelligent CV/offre | Python, FastAPI, Google Gemini (IA générative), RAG (sentence-transformers + ChromaDB), scikit-learn, PyMuPDF |
| **service-email** | Envoi de notifications | .NET / C#, PostgreSQL |
| **my_project** | Gestion des entretiens/candidatures | PHP, Symfony, PostgreSQL |
| **RabbitMQ** | Message broker (communication asynchrone inter-services) | RabbitMQ |
| **MinIO** | Stockage objet (CVs, documents) | MinIO (S3-compatible) |
| **MailDev** | Test d'envoi d'emails en local | MailDev |

### 🤖 Zoom sur le moteur intelligent (Service_ATS)

- **Parsing** de CVs (PDF/DOCX) et d'offres d'emploi.
- **RAG (Retrieval-Augmented Generation)** : indexation vectorielle des documents avec `sentence-transformers` + `ChromaDB` pour enrichir le contexte fourni à l'IA.
- **Agents spécialisés** : `SkillAgent`, `ExperienceAgent`, `EducationAgent` — chacun évalue un aspect du profil du candidat.
- **Final Scorer** : agrège les scores des agents pour produire un classement final des candidats par offre.
- **HR Preference Learner** : apprend des choix passés du recruteur pour ajuster la pondération du scoring dans le temps.
- Sécurisé par validation **JWT** sur les endpoints.

---

## 🚀 Lancer le projet en local

### Prérequis
- Docker & Docker Compose installés

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/<ton-username>/<nom-du-repo>.git
cd <nom-du-repo>

# 2. Configurer les variables d'environnement
cp .env.example .env
# puis éditer .env et renseigner ta propre clé GEMINI_API_KEY

# 3. Lancer tous les services
docker-compose -f docker-compose.global.yml up -d --build
```

### Accès aux services une fois démarrés

| Service | URL |
|---|---|
| Frontend Angular | http://localhost:4200 |
| API Gateway (Nginx) | http://localhost:80 |
| Interface RabbitMQ | http://localhost:15672 (guest/guest) |
| Console MinIO | http://localhost:9001 (admin/password) |
| MailDev (emails de test) | http://localhost:1080 |
| Service ATS (API directe) | http://localhost:8000/docs |

---

## 📂 Structure du repository

```
.
├── docker-compose.global.yml   # Orchestration complète du projet
├── .env.example                 # Variables d'environnement à configurer
├── nginx/                        # Configuration de l'API Gateway
├── Auth_Front/                   # Frontend Angular
├── AuthService/                  # Microservice authentification (.NET)
├── OffreRh/                       # Microservice offres d'emploi (Spring Boot)
├── Service_ATS/                   # Microservice IA de matching (FastAPI)
├── service-email/                 # Microservice notifications (.NET)
└── my_project/                    # Microservice entretiens (Symfony)
```

---

## 💡 Défis techniques relevés

- Orchestration d'une architecture **polyglotte** (.NET, Java, Python, PHP, Angular) au sein d'un seul système cohérent.
- Communication **asynchrone inter-services** via RabbitMQ pour découpler les traitements longs (scoring IA, envoi d'emails).
- Mise en place d'un **pipeline RAG** pour enrichir le scoring des candidatures avec du contexte métier.
- Conception d'un système **multi-agents** où chaque agent est spécialisé dans un critère d'évaluation, avec agrégation pondérée des scores.
- Apprentissage des préférences recruteur pour un scoring qui s'améliore avec l'usage.

---

## 📄 Licence

Projet académique (PFA) — à des fins de démonstration et de portfolio.
