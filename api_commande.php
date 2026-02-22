<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

// Gestion des requêtes
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Récupération des commandes (Filtres possibles)
    $status = $_GET['status'] ?? null;
    $client = $_GET['client'] ?? null;

    $sql = "SELECT * FROM commandes WHERE 1=1";
    $params = [];

    if ($status) {
        $sql .= " AND statut = ?";
        $params[] = $status;
    }
    if ($client) {
        $sql .= " AND (client_nom LIKE ? OR client_email LIKE ?)";
        $params[] = "%$client%";
        $params[] = "%$client%";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'PUT') {
    // Mise à jour (Statut ou Annulation)
    $data = json_decode(file_get_contents("php://input"), true);
    // ... Logique de mise à jour SQL (UPDATE commandes SET statut = ? ...)
    echo json_encode(["success" => true, "message" => "Commande mise à jour"]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

// Récupération des données JSON envoyées par le client
$data = json_decode(file_get_contents("php://input"), true);

// Règle métier : Validation des données obligatoires
if (empty($data['menu_id']) || empty($data['nom']) || empty($data['email']) || empty($data['nb_personnes'])) {
    http_response_code(400);
    echo json_encode(["error" => "Données incomplètes"]);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Format d'email invalide"]);
    exit;
}

try {
    // Logique de persistance : Enregistrement de la commande
    $stmt = $pdo->prepare("INSERT INTO commandes (
        menu_id, client_nom, client_prenom, client_email, client_gsm, 
        adresse_livraison, ville_livraison, distance_km, 
        date_prestation, heure_livraison, nb_personnes, statut
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')");
    
    $stmt->execute([
        $data['menu_id'], 
        $data['nom'], 
        $data['prenom'] ?? '', 
        $data['email'],
        $data['gsm'] ?? '',
        $data['adresse'] ?? '',
        $data['ville'] ?? '',
        $data['distance'] ?? 0,
        $data['date_prestation'] ?? null,
        $data['heure_livraison'] ?? null,
        $data['nb_personnes']
    ]);

    echo json_encode(["success" => true, "message" => "Merci " . htmlspecialchars($data['nom']) . ", votre commande a été validée !"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur lors de l'enregistrement"]);
}
?>