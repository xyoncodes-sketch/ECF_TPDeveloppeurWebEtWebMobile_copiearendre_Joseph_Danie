<?php
// Composant d'accès aux données (Data Access Component)
// Configuration de la connexion à la base de données MySQL

$host = 'localhost';
$dbname = 'vite_et_gourmand';
$username = 'root'; // À modifier selon votre configuration (ex: 'root' sur WAMP/XAMPP)
$password = '';     // À modifier selon votre configuration (souvent vide sur WAMP/XAMPP)

try {
    // Création de l'instance PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]));
}
?>