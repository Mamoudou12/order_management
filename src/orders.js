const connection = require('./db'); 
const readlineSync = require('readline-sync'); 

// Fonction pour lister toutes les commandes d'achat
async function listPurchaseOrders() {
  try {
    const [rows] = await connection.query('SELECT * FROM purchase_orders');
    console.table(rows);  
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes d\'achat :', err.message);
  }
}

// Fonction pour ajouter une commande d'achat
async function addPurchaseOrder(date, delivery_address, track_number, status, customer_id, order_details) {
  try {
    // Vérifier si les détails de la commande sont renseignés
    if (!order_details || order_details.length === 0) {
      throw new Error('Erreur : Les détails de la commande doivent être renseignés.');
    }

    // Ajouter la commande d'achat
    const [result] = await connection.query(
      'INSERT INTO purchase_orders (date, delivery_address, track_number, status, customer_id) VALUES (?, ?, ?, ?, ?)',
      [date, delivery_address, track_number, status, customer_id]
    );
    const purchaseOrderId = result.insertId;
    console.log('Commande d\'achat ajoutée avec succès, ID :', purchaseOrderId);

    // Afficher les détails de la commande pour confirmation
    console.log('\nDétails de la commande à ajouter :');
    console.table(order_details);

    // Demander à l'utilisateur s'il souhaite sauvegarder ou annuler
    const confirm = readlineSync.keyInYNStrict('Souhaitez-vous sauvegarder les détails de la commande ?');

    if (!confirm) {
      console.log('Les détails de la commande ont été annulés.');
      // Supprimer la commande d'achat si l'utilisateur annule
      await connection.query('DELETE FROM purchase_orders WHERE id = ?', [purchaseOrderId]);
      return;
    }

    // Ajouter les détails de la commande
    for (const detail of order_details) {
      // Vérifier si le produit existe
      const [productRows] = await connection.query('SELECT id FROM products WHERE id = ?', [detail.product_id]);
      if (productRows.length === 0) {
        console.error(`Erreur : Le produit avec ID ${detail.product_id} n'existe pas.`);
        // Supprimer la commande d'achat si l'un des produits n'existe pas
        await connection.query('DELETE FROM purchase_orders WHERE id = ?', [purchaseOrderId]);
        return;
      }

      // Ajouter les détails de la commande
      await connection.query(
        'INSERT INTO order_details (quantity, price, order_id, product_id) VALUES (?, ?, ?, ?)',
        [detail.quantity, detail.price, purchaseOrderId, detail.product_id]
      );
    }
    console.log('Détails de la commande ajoutés avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'ajout de la commande d\'achat :', err.message);
  }
}

// Fonction pour mettre à jour une commande d'achat et ses détails
async function updatePurchaseOrder(id, date, delivery_address, track_number, status, customer_id) {
  try {
    // Vérifier si la commande d'achat avec l'ID existe
    const [rows] = await connection.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);

    if (rows.length === 0) {
      throw new Error(`Erreur : Aucune commande d'achat trouvée avec l'ID ${id}.`);
    }

    // Mise à jour de la commande d'achat
    await connection.query(
      'UPDATE purchase_orders SET date = ?, delivery_address = ?, track_number = ?, status = ?, customer_id = ? WHERE id = ?',
      [date, delivery_address, track_number, status, customer_id, id]
    );
    console.log('Commande d\'achat mise à jour avec succès');

    // Demander à l'utilisateur s'il souhaite modifier les détails de la commande
    const modifyDetails = readlineSync.keyInYNStrict('Souhaitez-vous modifier les détails de la commande associés ?');

    if (modifyDetails) {
      // Lister les détails existants de la commande pour référence
      await listOrderDetails(id);

      // Demander à l'utilisateur quel détail il souhaite modifier
      const detailId = readlineSync.questionInt('Entrez l\'ID du détail de commande à modifier : ');

      // Demander les nouvelles valeurs pour le détail de commande
      const newQuantity = readlineSync.questionInt('Entrez la nouvelle quantité : ');
      const newPrice = readlineSync.questionFloat('Entrez le nouveau prix : ');
      const newProductId = readlineSync.questionInt('Entrez le nouvel ID produit : ');

      // Mettre à jour le détail de la commande
      await updateOrderDetails(id, detailId, newQuantity, newPrice, newProductId);
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la commande d\'achat :', err.message);
  }
}

// Fonction pour supprimer une commande d'achat
async function deletePurchaseOrder(id) {
  try {
    // Vérifier si la commande d'achat avec l'ID existe avant de tenter la suppression des détails associés
    const [rows] = await connection.query('SELECT * FROM purchase_orders WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log('Aucune commande d\'achat trouvée avec cet ID.');
      return;
    }

    // Supprimer les détails de la commande associés
    await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);

    // Supprimer la commande d'achat
    const [result] = await connection.query('DELETE FROM purchase_orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log('Aucune commande d\'achat trouvée avec cet ID.');
    } else {
      console.log('Commande d\'achat supprimée avec succès');
    }
  } catch (err) {
    console.error('Erreur lors de la suppression de la commande d\'achat :', err.message);
  }
}

// Fonction pour lister les détails de commande
async function listOrderDetails(orderId) {
  try {
    const [rows] = await connection.execute('SELECT * FROM order_details WHERE order_id = ?', [orderId]);
    if (rows.length === 0) {
      console.log('Aucun détail trouvé pour cette commande.');
      return;
    }
    console.log('\nDétails de la commande :');
    rows.forEach(detail => {
      console.log(`ID: ${detail.id}, Quantité: ${detail.quantity}, Prix: ${detail.price}, ID Produit: ${detail.product_id}`);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la commande :', error.message);
  }
}

// Fonction pour mettre à jour les détails d'une commande
async function updateOrderDetails(orderId, detailId, quantity, price, productId) {
  try {
    // Vérifier si le détail de la commande avec l'ID existe
    const [rows] = await connection.query('SELECT * FROM order_details WHERE id = ? AND order_id = ?', [detailId, orderId]);
    
    if (rows.length === 0) {
      throw new Error(`Erreur : Aucun détail de commande trouvé avec l'ID ${detailId} pour la commande ${orderId}.`);
    }

    // Si l'ID existe, procéder à la mise à jour
    await connection.query(
      'UPDATE order_details SET quantity = ?, price = ?, product_id = ? WHERE id = ? AND order_id = ?',
      [quantity, price, productId, detailId, orderId]
    );
    console.log('Détail de la commande mis à jour avec succès');
  } catch (err) {
    console.error('Erreur lors de la mise à jour des détails de la commande :', err.message);
  }
}

module.exports = {
  listPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  listOrderDetails,
  updateOrderDetails
};
