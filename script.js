// Simulation d'utilisateurs (Pour l'exercice)
let currentUser = {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@example.com",
    gsm: "0612345678",
    adresse: "10 Rue Sainte-Catherine",
    ville: "Bordeaux",
    role: "client"
};

let currentEmployee = {
    id: 99,
    nom: "Martin",
    prenom: "Paul",
    role: "employe"
};

// Données de secours (Mock) pour l'affichage si l'API n'est pas disponible
const mockMenus = [
    {
        id: 1,
        titre: "Menu Noël",
        description: "Dinde rôtie aux marrons, gratin dauphinois truffé, bûche glacée aux fruits rouges et champagne.",
        theme: "Noël",
        prix_min_personne: 45.00,
        nb_personne_min: 4,
        conditions: "Commander 1 semaine à l'avance.",
        regime: "Classique",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1576867757603-05b134ebc379?auto=format&fit=crop&w=800&q=80"],
        plats: [
            { nom: "Foie gras maison", type: "entree", allergenes: [] },
            { nom: "Dinde aux marrons", type: "plat", allergenes: ["Gluten"] },
            { nom: "Bûche glacée", type: "dessert", allergenes: ["Lactose"] }
        ]
    },
    {
        id: 2,
        titre: "Menu Pâques",
        description: "Gigot d'agneau de 7 heures, poêlée d'asperges vertes et nid de Pâques tout chocolat.",
        theme: "Pâques",
        prix_min_personne: 35.00,
        nb_personne_min: 2,
        conditions: "A conserver au frais.",
        regime: "Classique",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80"],
        plats: [
            { nom: "Salade printanière", type: "entree", allergenes: [] },
            { nom: "Gigot d'agneau", type: "plat", allergenes: [] }
        ]
    },
    {
        id: 3,
        titre: "Buffet Estival",
        description: "Assortiment de salades fraîches, grillades marinées, plateau de fromages et tarte aux fruits de saison.",
        theme: "Évènement",
        prix_min_personne: 25.00,
        nb_personne_min: 10,
        conditions: "Minimum 10 personnes.",
        regime: "Végétarien",
        stock: 5,
        images: ["https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"],
        plats: [
            { nom: "Salade de tomates", type: "entree", allergenes: [] }
        ]
    }
];

// Données des avis clients (Simulés pour l'affichage "validé")
const reviewsData = [
    {
        nom: "Sophie Martin",
        commentaire: "Un repas de Noël inoubliable ! La dinde était parfaite et le service impeccable. Je recommande vivement pour le professionnalisme.",
        note: 5,
        statut: "valide"
    },
    {
        nom: "Pierre Durand",
        commentaire: "Qualité et sérieux sont au rendez-vous. Merci à Julie et José pour ce buffet qui a ravi nos convives.",
        note: 5,
        statut: "valide"
    },
    {
        nom: "Marie Leroy",
        commentaire: "Excellent rapport qualité/prix. Les produits sont frais et l'équipe est très réactive.",
        note: 4,
        statut: "en_attente"
    }
];

// Fonction pour ouvrir la modale avec les détails
function openMenuDetails(menu) {
    const modal = document.getElementById('menu-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Construction de la galerie
    let galleryHtml = '<div class="gallery-container">';
    if (menu.images && menu.images.length > 0) {
        menu.images.forEach(img => {
            galleryHtml += `<img src="${img}" class="gallery-img" alt="${menu.titre}">`;
        });
    } else {
        galleryHtml += '<p>Pas d\'image disponible</p>';
    }
    galleryHtml += '</div>';

    // Construction de la liste des plats
    let platsHtml = '<ul>';
    if (menu.plats) {
        menu.plats.forEach(plat => {
            const allergenes = plat.allergenes && plat.allergenes.length > 0 ? ` <span class="tag">⚠️ ${plat.allergenes.join(', ')}</span>` : '';
            platsHtml += `<li><strong>${plat.type.toUpperCase()} :</strong> ${plat.nom}${allergenes}</li>`;
        });
    }
    platsHtml += '</ul>';

    modalBody.innerHTML = `
        <h2>${menu.titre} <span style="font-size:0.6em; color:#666">(${menu.theme})</span></h2>
        ${galleryHtml}
        <p><strong>Description :</strong> ${menu.description}</p>
        <div style="margin: 15px 0; background: #f9f9f9; padding: 10px; border-radius: 5px;">
            <p><strong>Régime :</strong> ${menu.regime} | <strong>Min. Personnes :</strong> ${menu.nb_personne_min}</p>
            <p><strong>Conditions :</strong> ${menu.conditions}</p>
            <p><strong>Stock restant :</strong> ${menu.stock}</p>
        </div>
        <h3>Composition du menu</h3>
        ${platsHtml}
        <div style="margin-top: 20px; text-align: center;">
            <span class="price" style="font-size: 2rem;">${menu.prix_min_personne || menu.prix}€ <small>/ pers.</small></span>
            <button class="btn" onclick="selectMenuAndScroll(${menu.id})">Commander ce menu</button>
        </div>
    `;
    
    modal.style.display = "block";
}

// Fonction pour générer le HTML d'une carte menu
function createMenuCard(menu) {
    const card = document.createElement('div');
    card.classList.add('menu-card');
    
    // On passe l'objet menu complet à la fonction openMenuDetails via une astuce JSON stringify (attention aux quotes)
    // Pour simplifier ici, on attache l'event listener après création ou on stocke les données.
    // Méthode simple : on stocke l'objet dans une propriété de l'élément DOM
    card.menuData = menu;
    
    const imgUrl = (menu.images && menu.images.length > 0) ? menu.images[0] : 'https://via.placeholder.com/400x250?text=Image+Non+Disponible';

    card.innerHTML = `
        <img src="${imgUrl}" alt="${menu.titre}" class="card-img-top">
        <div class="card-body">
            <h3>${menu.titre}</h3>
            <p>${menu.description}</p>
            <span class="price">Dès ${menu.prix_min_personne || menu.prix}€</span>
            <button class="btn-outline">Voir le menu</button>
        </div>
    `;
    
    // Ajout de l'événement clic sur le bouton "Voir"
    const btn = card.querySelector('.btn-outline');
    btn.addEventListener('click', () => openMenuDetails(menu));

    return card;
}

// Fonction pour générer le HTML d'une carte avis
function createReviewCard(review) {
    const card = document.createElement('div');
    card.classList.add('review-card');
    
    const stars = '★'.repeat(review.note) + '☆'.repeat(5 - review.note);
    
    card.innerHTML = `
        <div class="stars">${stars}</div>
        <p>"${review.commentaire}"</p>
        <div class="review-author">- ${review.nom}</div>
    `;
    return card;
}

// Fonction pour rediriger vers l'espace de commande avec le menu pré-rempli
function selectMenuAndScroll(id) {
    const select = document.getElementById('menu-select');
    const orderSection = document.getElementById('commande');
    const modal = document.getElementById('menu-modal');
    
    if (select && orderSection) {
        select.value = id; // Pré-sélection du menu
        select.dispatchEvent(new Event('change')); // Déclencher le recalcul du prix
        if(modal) modal.style.display = "none"; // Fermer la modale
        orderSection.scrollIntoView({ behavior: 'smooth' }); // Défilement fluide
    }
}

// --- Logique de Calcul de Prix ---
function updatePrice() {
    const menuSelect = document.getElementById('menu-select');
    const nbPersonnesInput = document.getElementById('nb_personnes');
    const villeInput = document.getElementById('ville');
    const distanceInput = document.getElementById('distance');
    
    // Récupération des éléments d'affichage
    const summaryDiv = document.getElementById('price-summary');
    const menuPriceDisplay = document.getElementById('menu-price-display');
    const discountDisplay = document.getElementById('discount-display');
    const deliveryPriceDisplay = document.getElementById('delivery-price-display');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const minPersonnesMsg = document.getElementById('min-personnes-msg');

    if (!menuSelect.value || !nbPersonnesInput.value) {
        summaryDiv.style.display = 'none';
        return;
    }

    // Trouver le menu sélectionné (dans mockMenus ou via l'API si on avait stocké les données globalement)
    // Pour simplifier ici, on cherche dans mockMenus car l'API charge aussi dans le DOM
    // Idéalement, on stockerait les menus chargés dans une variable globale `loadedMenus`
    let selectedMenu = mockMenus.find(m => m.id == menuSelect.value);
    // Fallback si chargé via API et non présent dans mockMenus (simulation)
    if (!selectedMenu) {
        // On essaie de récupérer les données attachées à l'option (si on avait stocké)
        // Pour l'exercice, on utilise mockMenus comme source de vérité
        return; 
    }

    const nbPersonnes = parseInt(nbPersonnesInput.value);
    const minPersonnes = selectedMenu.nb_personne_min;
    const prixUnitaire = selectedMenu.prix_min_personne;

    // Validation min personnes
    if (nbPersonnes < minPersonnes) {
        minPersonnesMsg.textContent = `Minimum ${minPersonnes} personnes pour ce menu.`;
        summaryDiv.style.display = 'none';
        return;
    } else {
        minPersonnesMsg.textContent = "";
    }

    summaryDiv.style.display = 'block';

    // 1. Prix Menu de base
    let totalMenu = prixUnitaire * nbPersonnes;
    
    // 2. Réduction (-10% si nb >= min + 5)
    let discount = 0;
    if (nbPersonnes >= (minPersonnes + 5)) {
        discount = totalMenu * 0.10;
    }

    // 3. Frais de livraison
    let deliveryCost = 0;
    const ville = villeInput.value.trim().toLowerCase();
    if (ville !== 'bordeaux' && ville !== '') {
        const distance = parseFloat(distanceInput.value) || 0;
        deliveryCost = 5 + (0.59 * distance);
    }

    // Total
    const finalTotal = totalMenu - discount + deliveryCost;

    // Affichage
    menuPriceDisplay.textContent = totalMenu.toFixed(2);
    discountDisplay.textContent = "-" + discount.toFixed(2);
    deliveryPriceDisplay.textContent = deliveryCost.toFixed(2);
    totalPriceDisplay.textContent = finalTotal.toFixed(2);
}

// --- Gestion Dashboard ---
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    // Trouver le bouton correspondant (simplifié)
    event.target.classList.add('active');
}

function showEmpTab(tabName) {
    document.querySelectorAll('#employee-dashboard .tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('#employee-dashboard .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).style.display = 'block';
    event.target.classList.add('active');
}

function renderOrders() {
    const container = document.getElementById('orders-list');
    // Simulation de commandes
    const orders = [
        { id: 101, menu: "Menu Noël", date: "2023-12-24", statut: "terminee", prix: 250.00 },
        { id: 102, menu: "Buffet Estival", date: "2024-06-15", statut: "accepte", prix: 180.00 },
        { id: 103, menu: "Menu Pâques", date: "2024-04-01", statut: "en_attente", prix: 140.00 }
    ];

    container.innerHTML = orders.map(order => {
        let actions = '';
        if (order.statut === 'en_attente') {
            actions = `<button class="btn-outline" onclick="alert('Commande annulée')">Annuler</button> 
                       <button class="btn-outline" onclick="alert('Modification...')">Modifier</button>`;
        } else if (order.statut === 'terminee') {
            actions = `<button class="btn" onclick="alert('Formulaire avis ouvert')">Donner un avis</button>`;
        } else if (order.statut === 'accepte') {
            actions = `<button class="btn-outline" onclick="alert('Suivi: Commande en préparation...')">Suivre</button>`;
        }

        return `
            <div class="order-item">
                <h4>Commande #${order.id} - ${order.menu}</h4>
                <p>Date: ${order.date} | Total: ${order.prix}€</p>
                <p>Statut: <strong>${order.statut.toUpperCase().replace('_', ' ')}</strong></p>
                <div style="margin-top:10px;">${actions}</div>
            </div>
        `;
    }).join('');
}

// --- Gestion Espace Employé ---

function getStatusColor(status) {
    const colors = {
        'en_attente': '#f1c40f', 'accepte': '#3498db', 'en_preparation': '#9b59b6',
        'en_cours_livraison': '#e67e22', 'livre': '#2ecc71', 'attente_materiel': '#e74c3c',
        'terminee': '#27ae60', 'annulee': '#7f8c8d'
    };
    return colors[status] || '#95a5a6';
}

function renderEmployeeOrders() {
    const container = document.getElementById('emp-orders-list');
    const filterStatus = document.getElementById('filter-status').value;
    const filterClient = document.getElementById('filter-client').value.toLowerCase();

    let url = 'api_commande.php?';
    if (filterStatus) url += `status=${filterStatus}&`;
    if (filterClient) url += `client=${filterClient}`;

    fetch(url)
        .then(res => res.json())
        .then(orders => {
            let html = `<table class="admin-table">
                <thead><tr><th>ID</th><th>Client</th><th>Menu</th><th>Statut</th><th>Action</th></tr></thead>
                <tbody>`;
            
            orders.forEach(o => {
                let nextAction = '';
                // Logique de changement de statut
                if (o.statut === 'en_attente') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'accepte')">Accepter</button>`;
                else if (o.statut === 'accepte') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'en_preparation')">En prépa</button>`;
                else if (o.statut === 'en_preparation') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'en_cours_livraison')">En livraison</button>`;
                else if (o.statut === 'en_cours_livraison') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'livre')">Livré</button>`;
                else if (o.statut === 'livre') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'attente_materiel')">Matériel prêté</button> <button class="btn" onclick="updateOrderStatus(${o.id}, 'terminee')">Terminer</button>`;
                else if (o.statut === 'attente_materiel') nextAction = `<button class="btn" onclick="updateOrderStatus(${o.id}, 'terminee')">Matériel rendu</button>`;

                let cancelBtn = (o.statut !== 'terminee' && o.statut !== 'annulee') ? 
                    `<button class="btn-outline" style="font-size:0.8rem; color:#c0392b; border-color:#c0392b;" onclick="openCancelModal(${o.id})">Annuler</button>` : '';

                html += `<tr>
                    <td>#${o.id}</td>
                    <td>${o.client_nom} ${o.client_prenom || ''}</td>
                    <td>${o.menu_titre || 'Menu #' + o.menu_id}</td>
                    <td><span class="status-badge" style="background:${getStatusColor(o.statut)}">${o.statut}</span></td>
                    <td>${nextAction} ${cancelBtn}</td>
                </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = '<p>Erreur de chargement des commandes.</p>';
        });
}

function updateOrderStatus(id, newStatus) {
    fetch('api_commande.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, statut: newStatus })
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            if (newStatus === 'attente_materiel') {
                alert(`Email envoyé au client : "Merci de restituer le matériel sous 10 jours ouvrés, sinon 600€ de frais seront appliqués."`);
            }
            renderEmployeeOrders();
        } else {
            alert('Erreur: ' + data.error);
        }
    })
    .catch(err => console.error(err));
}

function openCancelModal(id) {
    document.getElementById('cancel-order-id').value = id;
    document.getElementById('cancel-modal').style.display = 'block';
}

function closeCancelModal() {
    document.getElementById('cancel-modal').style.display = 'none';
}

function filterOrders() {
    renderEmployeeOrders();
}

function renderEmployeeReviews() {
    const container = document.getElementById('emp-reviews-list');
    container.innerHTML = '';
    reviewsData.forEach((review, index) => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="stars">${'★'.repeat(review.note)}</div>
            <p>"${review.commentaire}"</p>
            <div class="review-author">- ${review.nom}</div>
            <div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px;">
                Status: <strong>${review.statut}</strong><br>
                ${review.statut === 'en_attente' ? 
                `<button class="btn" style="font-size:0.8rem; padding:5px 10px;" onclick="validateReview(${index}, 'valide')">Valider</button>
                 <button class="btn-outline" style="font-size:0.8rem; padding:5px 10px;" onclick="validateReview(${index}, 'refuse')">Refuser</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

function validateReview(index, status) {
    reviewsData[index].statut = status;
    renderEmployeeReviews();
    // Re-render public reviews to show only validated ones
    const publicContainer = document.getElementById('reviews-container');
    if(publicContainer) {
        publicContainer.innerHTML = '';
        reviewsData.filter(r => r.statut === 'valide').forEach(r => publicContainer.appendChild(createReviewCard(r)));
    }
}

function renderEmployeeMenus() {
    const container = document.getElementById('emp-menus-list');
    
    fetch('api_menus.php')
        .then(res => res.json())
        .then(menus => {
            let html = `<table class="admin-table"><thead><tr><th>Titre</th><th>Prix</th><th>Stock</th><th>Action</th></tr></thead><tbody>`;
            menus.forEach(m => {
                html += `<tr>
                    <td>${m.titre}</td>
                    <td>${m.prix_min_personne}€</td>
                    <td>${m.stock}</td>
                    <td>
                        <button class="btn-outline" onclick="alert('Modifier menu ${m.id}')">Modifier</button>
                        <button class="btn-outline" style="color:red; border-color:red;" onclick="alert('Supprimer menu ${m.id}')">Supprimer</button>
                    </td>
                </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const reviewsContainer = document.getElementById('reviews-container');
    const modal = document.getElementById('menu-modal');
    const closeModal = document.querySelector('.close-modal');
    const menuSelect = document.getElementById('menu-select');
    const orderForm = document.getElementById('order-form');
    const loginBtn = document.getElementById('login-btn');
    const cancelForm = document.getElementById('cancel-form');
    
    // Inputs pour calcul prix
    const nbPersonnesInput = document.getElementById('nb_personnes');
    const villeInput = document.getElementById('ville');
    const distanceInput = document.getElementById('distance');
    const distanceGroup = document.getElementById('distance-group');

    // Gestion de la fermeture de la modale
    if (closeModal) {
        closeModal.onclick = () => modal.style.display = "none";
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Fonction utilitaire pour ajouter une option au select
    const addOptionToSelect = (menu) => {
        if (menuSelect) {
            const option = document.createElement('option');
            option.value = menu.id;
            option.textContent = `${menu.titre} - Dès ${menu.prix_min_personne || menu.prix}€`;
            menuSelect.appendChild(option);
        }
    };

    // Simulation Connexion
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Simulation simple : Alternance Client / Employé pour la démo
            const isEmployee = confirm("Se connecter en tant qu'employé ? (Annuler pour Client)");
            
            if (isEmployee) {
                document.getElementById('emp-link').style.display = 'block';
                document.getElementById('user-link').style.display = 'none';
                renderEmployeeOrders();
                renderEmployeeMenus();
                renderEmployeeReviews();
            } else {
                document.getElementById('nom').value = currentUser.nom;
                document.getElementById('prenom').value = currentUser.prenom;
                document.getElementById('email').value = currentUser.email;
                document.getElementById('gsm').value = currentUser.gsm;
                document.getElementById('adresse').value = currentUser.adresse;
                document.getElementById('ville').value = currentUser.ville;
                
                document.getElementById('user-link').style.display = 'block';
                document.getElementById('emp-link').style.display = 'none';
                renderOrders();
            }
            loginBtn.textContent = "Déconnexion";
            
            // Trigger ville change pour afficher distance si besoin
            villeInput.dispatchEvent(new Event('input'));
        });
    }

    // Listeners pour calcul prix
    if (menuSelect) menuSelect.addEventListener('change', updatePrice);
    if (nbPersonnesInput) nbPersonnesInput.addEventListener('input', updatePrice);
    
    if (villeInput) {
        villeInput.addEventListener('input', function() {
            const ville = this.value.trim().toLowerCase();
            if (ville !== 'bordeaux' && ville !== '') {
                distanceGroup.style.display = 'block';
            } else {
                distanceGroup.style.display = 'none';
                distanceInput.value = 0;
            }
            updatePrice();
        });
    }
    if (distanceInput) distanceInput.addEventListener('input', updatePrice);

    if (menuContainer) {
        // Appel AJAX vers le composant d'accès aux données (API PHP)
        fetch('api_menus.php')
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    data.forEach(menu => {
                        menuContainer.appendChild(createMenuCard(menu));
                        addOptionToSelect(menu); // Peupler le select
                    });
                } else {
                    throw new Error("Format de données invalide");
                }
            })
            .catch(error => {
                console.warn('API non disponible, chargement des données de secours:', error);
                mockMenus.forEach(menu => {
                    menuContainer.appendChild(createMenuCard(menu));
                    addOptionToSelect(menu); // Peupler le select avec les mocks
                });
            });
    }

    // Gestion de la soumission du formulaire de commande
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            fetch('api_commande.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    orderForm.reset();
                } else {
                    alert("Erreur : " + data.error);
                }
            })
            .catch(error => {
                console.warn('API non disponible (Mode démo/statique):', error);
                alert("Simulation (GitHub Pages) : Merci " + (data.nom || 'Client') + ", votre commande a été validée !");
                orderForm.reset();
            });
        });
    }

    // Chargement des avis clients
    if (reviewsContainer) {
        reviewsData.filter(r => r.statut === 'valide').forEach(review => {
            reviewsContainer.appendChild(createReviewCard(review));
        });
    }

    // Gestion Annulation
    if (cancelForm) {
        cancelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('cancel-order-id').value;
            const motif = document.getElementById('cancel-reason').value;
            const contact = document.getElementById('cancel-contact').value;
            
            fetch('api_commande.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, statut: 'annulee', motif: motif, contact: contact })
            }).then(() => {
                closeCancelModal();
                renderEmployeeOrders();
            });
        });
    }
});