const connection = require('./db');

// Validation des données pour les produits
function validateProductData(name, description, price, stock, category, barcode, status) {
    if (typeof name !== 'string' || name.trim() === '') {
        throw new Error('Le nom du produit est requis et doit être une chaîne de caractères.');
    }
    if (typeof description !== 'string' || description.trim() === '') {
        throw new Error('La description du produit est requise et doit être une chaîne de caractères.');
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        throw new Error('Le prix doit être un nombre décimal positif.');
    }
    if (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0) {
        throw new Error('Le stock doit être un nombre entier positif.');
    }
    if (typeof category !== 'string' || category.trim() === '') {
        throw new Error('La catégorie du produit est requise et doit être une chaîne de caractères.');
    }
    if (typeof barcode !== 'string' || barcode.trim() === '') {
        throw new Error('Le code-barres est requis et doit être une chaîne de caractères.');
    }
    if (typeof status !== 'string' || status.trim() === '') {
        throw new Error('Le statut est requis et doit être une chaîne de caractères.');
    }
}

// List all products
async function listProducts() {
    try {
        const [rows] = await connection.execute('SELECT * FROM products');
        console.table(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err.message);
    }
}

// Add a new product
async function addProduct(name, description, price, stock, category, barcode, status) {
    try {
        // Validation des données
        validateProductData(name, description, price, stock, category, barcode, status);

        // Insertion dans la base de données
        await connection.execute(
            'INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [name, description, parseFloat(price), parseInt(stock, 10), category, barcode, status]
        );
        console.log('Produit ajouté avec succès.');
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit :', err.message);
    }
}

// Update an existing product
async function updateProduct(id, name, description, price, stock, category, barcode, status) {
    try {
        // Validation des données
        validateProductData(name, description, price, stock, category, barcode, status);

        // Vérifier si le produit avec l'ID existe
        const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            // Lever une exception si l'ID n'existe pas
            throw new Error(`Erreur : Aucun produit trouvé avec l'ID ${id}.`);
        }

        // Si l'ID existe, procéder à la mise à jour
        await connection.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?',
            [name, description, parseFloat(price), parseInt(stock, 10), category, barcode, status, id]
        );
        console.log('Produit mis à jour avec succès.');
    } catch (err) {
        console.error('Erreur lors de la mise à jour du produit :', err.message);
    }
}

// Delete a product
async function deleteProduct(id) {
    try {
        // Vérifier si le produit avec l'ID existe
        const [rows] = await connection.execute('SELECT * FROM products WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            // Lever une exception si l'ID n'existe pas
            throw new Error(`Erreur : Aucun produit trouvé avec l'ID ${id}.`);
        }

        // Si l'ID existe, procéder à la suppression
        await connection.execute('DELETE FROM products WHERE id = ?', [id]);
        console.log('Produit supprimé avec succès.');
    } catch (err) {
        console.error('Erreur lors de la suppression du produit :', err.message);
    }
}

module.exports = { listProducts, addProduct, updateProduct, deleteProduct };

