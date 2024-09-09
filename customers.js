// models/customers.js
const connection = require('./db.js');

// Fonction pour lister tous les clients
async function listCustomers() {
  try {
    const [rows] = await connection.query('SELECT * FROM customers');
    console.log('Liste des clients:', rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
  }
}

// Fonction pour ajouter un client
async function addCustomer(name, address, email, phone) {
  try {
    const [result] = await connection.query(
      'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
      [name, address, email, phone]
    );
    console.log('Client ajouté avec succès, ID:', result.insertId);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du client:', err);
  }
}

// Fonction pour mettre à jour un client
async function updateCustomer(id, name, address, email, phone) {
  try {
    await connection.query(
      'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
      [name, address, email, phone, id]
    );
    console.log('Client mis à jour avec succès');
  } catch (err) {
    console.error('Erreur lors de la mise à jour du client:', err);
  }
}

// Fonction pour supprimer un client
async function deleteCustomer(id) {
  try {
    await connection.query('DELETE FROM customers WHERE id = ?', [id]);
    console.log('Client supprimé avec succès');
  } catch (err) {
    console.error('Erreur lors de la suppression du client:', err);
  }
}

module.exports = { listCustomers, addCustomer, updateCustomer, deleteCustomer };
