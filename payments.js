const connection = require('./db');

// Fonction pour lister tous les paiements
async function listPayments() {
  try {
    const [rows] = await connection.query('SELECT * FROM payments');
    console.table(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des paiements:', err);
  }
}

// Fonction pour ajouter un paiement
async function addPayment(date, amount, paymentMethod, orderId) {
  try {
    const [result] = await connection.query(
      'INSERT INTO payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)',
      [date, amount, paymentMethod, orderId]
    );
    console.log('Paiement ajouté avec succès, ID:', result.insertId);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du paiement:', err);
  }
}

// Fonction pour mettre à jour un paiement
async function updatePayment(id, date, amount, paymentMethod, orderId) {
  try {
    const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);

    if (rows.length === 0) {
      throw new Error(`Erreur : Aucun paiement trouvé avec l'ID ${id}.`);
    }

    await connection.query(
      'UPDATE payments SET date = ?, amount = ?, payment_method = ?, order_id = ? WHERE id = ?',
      [date, amount, paymentMethod, orderId, id]
    );
    console.log('Paiement mis à jour avec succès');
  } catch (err) {
    console.error('Erreur lors de la mise à jour du paiement:', err.message);
  }
}

// Fonction pour supprimer un paiement
async function deletePayment(id) {
  try {
    const [result] = await connection.query('DELETE FROM payments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log('Aucun paiement trouvé avec cet ID.');
    } else {
      console.log('Paiement supprimé avec succès');
    }
  } catch (err) {
    console.error('Erreur lors de la suppression du paiement:', err);
  }
}

module.exports = { listPayments, addPayment, updatePayment, deletePayment };
