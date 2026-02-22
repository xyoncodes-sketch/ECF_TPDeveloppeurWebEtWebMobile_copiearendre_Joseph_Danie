# Guide de Déploiement - Vite & Gourmand

Ce document décrit la procédure pour déployer l'application web "Vite & Gourmand" sur un serveur de production.

## 1. Prérequis Serveur
Le serveur d'hébergement doit disposer de la configuration suivante (Stack LAMP/LEMP) :
- **Serveur Web** : Apache 2.4+ ou Nginx.
- **Langage** : PHP 7.4 ou supérieur.
- **Base de données** : MySQL 5.7+ ou MariaDB 10.3+.
- **Accès** : FTP/SFTP pour les fichiers et phpMyAdmin (ou CLI) pour la base de données.

## 2. Installation de la Base de Données
1. Connectez-vous à votre interface de gestion de base de données (ex: phpMyAdmin).
2. Créez une nouvelle base de données (ex: `vite_et_gourmand_prod`).
3. Importez le fichier `database.sql` situé à la racine du projet.
4. Vérifiez que les tables `menus` et `commandes` sont bien créées.

## 3. Installation des Fichiers
Transférez les fichiers du projet vers le dossier public de votre serveur web (ex: `/var/www/html` ou `/public_html`).

Respectez l'arborescence suivante pour que les liens fonctionnent :
```text
/ (Racine du site)
├── index.html
├── api_menus.php
├── api_commande.php
├── db_connect.php
├── css/
│   └── style.css
└── js/
    └── script.js
```

## 4. Configuration de la Connexion
Une fois les fichiers en ligne, vous devez connecter l'application PHP à la base de données de production.

1. Ouvrez le fichier `db_connect.php` sur le serveur.
2. Modifiez les variables suivantes avec les identifiants fournis par votre hébergeur :
   ```php
   $host = 'adresse_du_serveur_bdd'; // Souvent 'localhost'
   $dbname = 'vite_et_gourmand_prod';
   $username = 'votre_utilisateur';
   $password = 'votre_mot_de_passe';
   ```

## 5. Vérification
1. Accédez à l'URL de votre site (ex: `https://www.vite-et-gourmand.fr`).
2. Vérifiez que les menus s'affichent (cela confirme que `api_menus.php` communique avec la BDD).
3. Effectuez une commande de test pour vérifier l'écriture dans la table `commandes`.