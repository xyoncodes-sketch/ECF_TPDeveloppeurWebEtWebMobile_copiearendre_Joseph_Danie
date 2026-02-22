-- Création de la base de données
CREATE DATABASE IF NOT EXISTS vite_et_gourmand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vite_et_gourmand;

-- Tables de référence (Allergènes, Plats)
CREATE TABLE IF NOT EXISTS allergenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    type ENUM('entree', 'plat', 'dessert') NOT NULL
);

CREATE TABLE IF NOT EXISTS plat_allergenes (
    plat_id INT,
    allergene_id INT,
    PRIMARY KEY (plat_id, allergene_id),
    FOREIGN KEY (plat_id) REFERENCES plats(id),
    FOREIGN KEY (allergene_id) REFERENCES allergenes(id)
);

-- Création de la table des menus
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT,
    theme VARCHAR(50),
    prix_min_personne DECIMAL(10, 2) NOT NULL,
    nb_personne_min INT DEFAULT 1,
    conditions TEXT,
    regime VARCHAR(50) DEFAULT 'Classique',
    stock INT DEFAULT 0
);

-- Table de liaison Menus <-> Plats
CREATE TABLE IF NOT EXISTS menu_plats (
    menu_id INT,
    plat_id INT,
    PRIMARY KEY (menu_id, plat_id),
    FOREIGN KEY (menu_id) REFERENCES menus(id),
    FOREIGN KEY (plat_id) REFERENCES plats(id)
);

-- Table pour la galerie d'images
CREATE TABLE IF NOT EXISTS menu_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

-- Création de la table des commandes
CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_id INT NOT NULL,
    client_nom VARCHAR(100) NOT NULL,
    client_prenom VARCHAR(100),
    client_email VARCHAR(100) NOT NULL,
    client_gsm VARCHAR(20),
    adresse_livraison VARCHAR(255),
    ville_livraison VARCHAR(100),
    distance_km DECIMAL(5, 2) DEFAULT 0,
    date_prestation DATE,
    heure_livraison TIME,
    nb_personnes INT NOT NULL,
    prix_total DECIMAL(10, 2),
    frais_livraison DECIMAL(10, 2),
    statut ENUM('en_attente', 'accepte', 'en_preparation', 'en_cours_livraison', 'livre', 'attente_materiel', 'terminee', 'annulee') DEFAULT 'en_attente',
    motif_annulation TEXT,
    mode_contact_annulation VARCHAR(50),
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

-- Table Utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'employe', 'admin') DEFAULT 'client',
    gsm VARCHAR(20),
    adresse VARCHAR(255),
    ville VARCHAR(100)
);

-- Table Avis
CREATE TABLE IF NOT EXISTS avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    date_avis DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);

-- Données de test (Fixtures)
INSERT INTO allergenes (nom) VALUES ('Gluten'), ('Lactose'), ('Arachides');

INSERT INTO plats (nom, type) VALUES 
('Foie gras maison', 'entree'),
('Dinde aux marrons', 'plat'),
('Bûche glacée', 'dessert'),
('Salade de chèvre chaud', 'entree'),
('Gigot d\'agneau', 'plat');

INSERT INTO plat_allergenes (plat_id, allergene_id) VALUES 
(2, 1), (3, 2), (4, 2); -- Ex: Gluten dans la dinde, Lactose dans la bûche et la salade

INSERT INTO menus (titre, description, theme, prix_min_personne, nb_personne_min, conditions, regime, stock) VALUES 
('Menu Noël Féerique', 'Un repas traditionnel pour les fêtes.', 'Noël', 45.00, 4, 'Commander 1 semaine à l\'avance', 'Classique', 10),
('Pâques Gourmand', 'Célébrez le printemps.', 'Pâques', 35.00, 2, 'A conserver au frais', 'Classique', 15),
('Buffet Végétarien', 'Fraîcheur et légèreté.', 'Évènement', 25.00, 10, 'Minimum 10 personnes', 'Végétarien', 5);

INSERT INTO menu_plats (menu_id, plat_id) VALUES 
(1, 1), (1, 2), (1, 3), -- Noël
(2, 4), (2, 5);         -- Pâques

INSERT INTO menu_images (menu_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=800&q=80'),
(1, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'),
(2, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80'),
(3, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80');

-- Employé de test
INSERT INTO utilisateurs (nom, prenom, email, password, role) VALUES ('Martin', 'Paul', 'employe@fastdev.fr', 'password', 'employe');