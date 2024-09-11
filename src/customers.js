const connection = require('./db');

// Fonction pour lister tous les clients
async function listCustomers() {
  try {
    const [rows] = await connection.query('SELECT * FROM customers');
    console.table(rows);
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
    // Vérifier si le client avec l'ID existe
    const [rows] = await connection.query('SELECT * FROM customers WHERE id = ?', [id]);

    if (rows.length === 0) {
      // Lever une exception si l'ID n'existe pas
      throw new Error(`Erreur : Aucun client trouvé avec l'ID ${id}.`);
    }

    // Si l'ID existe, procéder à la mise à jour
    await connection.query(
      'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
      [name, address, email, phone, id]
    );
    console.log('Client mis à jour avec succès');
  } catch (err) {
    // Gestion des erreurs, y compris l'exception levée
    console.error('Erreur lors de la mise à jour du client:', err.message);
  }
}

// Fonction pour supprimer un client
async function deleteCustomer(id) {
  try {
    const [result] = await connection.query('DELETE FROM customers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log('Aucun client trouvé avec cet ID.');
    } else {
      console.log('Client supprimé avec succès');
    }
  } catch (err) {
    console.error('Erreur lors de la suppression du client:', err);
  }
}

module.exports = { listCustomers, addCustomer, updateCustomer, deleteCustomer };
