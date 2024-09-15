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
async function addPayment(date, amount, payment_method, order_id) {
    try {
        // Vérifier que tous les champs sont fournis
        if (!date || !amount || !payment_method || !order_id) {
            console.error('Erreur : Tous les champs (date, montant, méthode de paiement, ID de commande) sont obligatoires.');
            return;
        }

        // Vérifier si la commande d'achat avec l'ID existe
        const [orderRows] = await connection.query('SELECT id FROM purchase_orders WHERE id = ?', [order_id]);

        if (orderRows.length === 0) {
            console.error(`Erreur : Aucune commande d'achat trouvée avec l'ID ${order_id}.`);
            return;
        }

        // Validation du montant
        if (isNaN(amount) || amount <= 0 || typeof amount !== 'number') {
            console.error('Erreur : Le montant doit être un nombre décimal positif.');
            return;
        }

        // Ajouter le paiement
        await connection.query(
            'INSERT INTO payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)',
            [date, amount, payment_method, order_id]
        );
        console.log('Paiement ajouté avec succès');
    } catch (err) {
        console.error('Erreur lors de l\'ajout du paiement :', err.message);
    }
}

// Fonction pour mettre à jour un paiement
async function updatePayment(id, date, amount, paymentMethod, orderId) {
    try {
        // Vérifier que tous les champs sont fournis
        if (!id || !date || !amount || !paymentMethod || !orderId) {
            console.error('Erreur : Tous les champs (ID, date, montant, méthode de paiement, ID de commande) sont obligatoires.');
            return;
        }

        // Vérifier si le paiement existe
        const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);

        if (rows.length === 0) {
            throw new Error(`Erreur : Aucun paiement trouvé avec l'ID ${id}.`);
        }

        // Validation du montant
        if (isNaN(amount) || amount <= 0 || typeof amount !== 'number') {
            console.error('Erreur : Le montant doit être un nombre décimal positif.');
            return;
        }

        // Mettre à jour le paiement
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
        // Vérifier que l'ID est fourni
        if (!id) {
            console.error('Erreur : L\'ID est obligatoire pour supprimer un paiement.');
            return;
        }

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
