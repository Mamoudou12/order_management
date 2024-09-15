const connection = require('./db');

// Fonction pour valider les champs client
function validateCustomerFields(name, address, email, phone) {
  const errors = [];

  // Vérification du nom (doit être non vide)
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Le nom est obligatoire et doit être une chaîne de caractères non vide.');
  }

  // Vérification de l'adresse (doit être non vide)
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.push('L\'adresse est obligatoire et doit être une chaîne de caractères non vide.');
  }

  // Vérification de l'email (doit être un format valide)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('L\'email est invalide.');
  }

  // Vérification du téléphone (doit contenir exactement 8 chiffres)
  const phoneRegex = /^\d{8}$/;
  if (!phone || !phoneRegex.test(phone)) {
    errors.push('Le numéro de téléphone doit contenir exactement 8 chiffres.');
  }

  return errors;
}

// Fonction pour lister tous les clients
async function listCustomers() {
  try {
    const [rows] = await connection.query('SELECT * FROM customers');
    console.table(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des clients:', err);
  }
}

// Fonction pour ajouter un client avec validation
async function addCustomer(name, address, email, phone) {
  // Validation des champs
  const errors = validateCustomerFields(name, address, email, phone);
  if (errors.length > 0) {
    console.error('Erreur(s) de validation:', errors.join(', '));
    return;
  }

  try {
    const [result] = await connection.query(
      'INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)',
      [name, address, email, phone]
    );
    console.log('Client ajouté avec succès, ID:', result.insertId);
  } catch (err) {
    console.error('Erreur lors de l\'ajout du client:', err.message);
  }
}

// Fonction pour mettre à jour un client avec validation
async function updateCustomer(id, name, address, email, phone) {
  // Validation des champs
  const errors = validateCustomerFields(name, address, email, phone);
  if (errors.length > 0) {
    console.error('Erreur(s) de validation:', errors.join(', '));
    return;
  }

  try {
    const [rows] = await connection.query('SELECT * FROM customers WHERE id = ?', [id]);

    if (rows.length === 0) {
      throw new Error(`Erreur : Aucun client trouvé avec l'ID ${id}.`);
    }

    await connection.query(
      'UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?',
      [name, address, email, phone, id]
    );
    console.log('Client mis à jour avec succès');
  } catch (err) {
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
    console.error('Erreur lors de la suppression du client:', err.message);
  }
}

module.exports = { listCustomers, addCustomer, updateCustomer, deleteCustomer };
