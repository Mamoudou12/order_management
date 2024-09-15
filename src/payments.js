const connection = require('./db');
const moment = require('moment'); 

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
            throw new Error('Tous les champs (date, montant, méthode de paiement, ID de commande) sont obligatoires.');
        }

        // Validation du format de la date
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            throw new Error('La date doit être au format YYYY-MM-DD.');
        }

        // Validation du montant
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Le montant doit être un nombre décimal positif.');
        }

        // Vérifier si la commande d'achat avec l'ID existe
        const [orderRows] = await connection.query('SELECT id FROM purchase_orders WHERE id = ?', [order_id]);

        if (orderRows.length === 0) {
            throw new Error(`Aucune commande d'achat trouvée avec l'ID ${order_id}.`);
        }

        // Vérifier la méthode de paiement
        const validPaymentMethods = ['credit_card', 'Bankily', 'Masrvi']; // Exemple de méthodes acceptées
        if (!validPaymentMethods.includes(payment_method)) {
            throw new Error(`Méthode de paiement non valide. Les méthodes valides sont : ${validPaymentMethods.join(', ')}.`);
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
async function updatePayment(id, date, amount, payment_method, order_id) {
    try {
        // Vérifier que tous les champs sont fournis
        if (!id || !date || !amount || !payment_method || !order_id) {
            throw new Error('Tous les champs (ID, date, montant, méthode de paiement, ID de commande) sont obligatoires.');
        }

        // Validation du format de la date
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            throw new Error('La date doit être au format YYYY-MM-DD.');
        }

        // Validation du montant
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Le montant doit être un nombre décimal positif.');
        }

        // Vérifier si le paiement existe
        const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);

        if (rows.length === 0) {
            throw new Error(`Aucun paiement trouvé avec l'ID ${id}.`);
        }

        // Vérifier la méthode de paiement
        const validPaymentMethods = ['credit_card', 'Bankily', 'Masrvi'];
        if (!validPaymentMethods.includes(payment_method)) {
            throw new Error(`Méthode de paiement non valide. Les méthodes valides sont : ${validPaymentMethods.join(', ')}.`);
        }

        // Mettre à jour le paiement
        await connection.query(
            'UPDATE payments SET date = ?, amount = ?, payment_method = ?, order_id = ? WHERE id = ?',
            [date, amount, payment_method, order_id, id]
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
            throw new Error('L\'ID est obligatoire pour supprimer un paiement.');
        }

        const [result] = await connection.query('DELETE FROM payments WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            console.log('Aucun paiement trouvé avec cet ID.');
        } else {
            console.log('Paiement supprimé avec succès');
        }
    } catch (err) {
        console.error('Erreur lors de la suppression du paiement:', err.message);
    }
}

module.exports = { listPayments, addPayment, updatePayment, deletePayment };
