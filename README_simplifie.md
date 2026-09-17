# Système Intelligent de Recrutement

Plateforme de recrutement (ATS) construite en architecture microservices. Le système analyse automatiquement les CVs des candidats et les classe selon leur pertinence par rapport à une offre d'emploi.

## Fonctionnalités

- Publication et gestion des offres d'emploi
- Dépôt de CV par les candidats
- Analyse et scoring automatique des candidatures
- Classement des candidats par pertinence
- Tableau de bord RH avec suivi du pipeline de recrutement
- Gestion des entretiens
- Notifications par email
- Authentification par rôle (Candidat, RH, Technique)

## Aperçu

**Connexion**

(glisser ici la capture de l'écran de connexion)

**Espace RH**

(glisser ici la capture du dashboard RH)

## Architecture

Le projet est composé de plusieurs microservices indépendants, chacun avec sa propre base de données, communiquant entre eux via RabbitMQ et exposés via une passerelle API (Nginx).

| Service | Rôle | Technologies |
|---|---|---|
| Auth_Front | Interface utilisateur | Angular |
| nginx | Passerelle API | Nginx |
| AuthService | Authentification et gestion des comptes | .NET, PostgreSQL |
| OffreRh | Gestion des offres d'emploi | Java, Spring Boot, PostgreSQL |
| Service_ATS | Analyse et scoring des CVs | Python, FastAPI |
| service-email | Envoi des notifications | .NET, PostgreSQL |
| my_project | Gestion des entretiens | PHP, Symfony, PostgreSQL |
| RabbitMQ | Communication asynchrone entre services | RabbitMQ |
| MinIO | Stockage des fichiers (CVs) | MinIO |

## Lancer le projet

Prérequis : Docker et Docker Compose installés.

```bash
git clone https://github.com/fatimazahrasidhoum23-spec/systeme-intelligent-recrutement.git
cd systeme-intelligent-recrutement

cp .env.example .env
# puis renseigner tes propres valeurs dans .env

docker-compose -f docker-compose.global.yml up -d --build
```

Une fois lancé :

| Service | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:80 |
| RabbitMQ | http://localhost:15672 |
| MinIO | http://localhost:9001 |

## Structure du projet

```
.
├── docker-compose.global.yml
├── .env.example
├── nginx/
├── Auth_Front/
├── AuthService/
├── OffreRh/
├── Service_ATS/
├── service-email/
└── my_project/
```
