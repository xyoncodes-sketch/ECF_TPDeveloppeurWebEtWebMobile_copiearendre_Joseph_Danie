<?php
// Ce fichier agit comme une API REST simple
header('Content-Type: application/json');

// Inclusion du composant d'accès aux données
require_once 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Création ou Mise à jour d'un menu
    $data = json_decode(file_get_contents("php://input"), true);
    // ... Logique INSERT ou UPDATE SQL ...
    echo json_encode(["success" => true, "message" => "Menu enregistré"]);
    exit;
}

if ($method === 'DELETE') {
    // Suppression d'un menu
    $id = $_GET['id'];
    // ... Logique DELETE SQL ...
    echo json_encode(["success" => true, "message" => "Menu supprimé"]);
    exit;
}

try {
    // Requête SQL pour récupérer tous les menus
    $sql = "SELECT * FROM menus";
    $stmt = $pdo->query($sql);
    $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pour chaque menu, on récupère les détails (images, plats, allergènes)
    // Note: Dans un projet réel à fort trafic, on optimiserait avec des JOINs, 
    // mais ici on boucle pour la clarté et la structure JSON.
    foreach ($menus as &$menu) {
        $menuId = $menu['id'];

        // Récupération des images (Galerie)
        $stmtImg = $pdo->prepare("SELECT image_url FROM menu_images WHERE menu_id = ?");
        $stmtImg->execute([$menuId]);
        $menu['images'] = $stmtImg->fetchAll(PDO::FETCH_COLUMN);

        // Récupération des plats
        $stmtPlats = $pdo->prepare("
            SELECT p.nom, p.type, p.id 
            FROM plats p 
            JOIN menu_plats mp ON p.id = mp.plat_id 
            WHERE mp.menu_id = ?
        ");
        $stmtPlats->execute([$menuId]);
        $plats = $stmtPlats->fetchAll(PDO::FETCH_ASSOC);

        // Récupération des allergènes pour chaque plat
        foreach ($plats as &$plat) {
            $stmtAllerg = $pdo->prepare("
                SELECT a.nom FROM allergenes a 
                JOIN plat_allergenes pa ON a.id = pa.allergene_id 
                WHERE pa.plat_id = ?");
            $stmtAllerg->execute([$plat['id']]);
            $plat['allergenes'] = $stmtAllerg->fetchAll(PDO::FETCH_COLUMN);
        }
        $menu['plats'] = $plats;
    }

    // Renvoi des données au format JSON pour le front-end
    echo json_encode($menus);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>