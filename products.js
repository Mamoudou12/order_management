const connection = require('./db');

// List all products
async function listProducts() {
    const [rows] = await connection.execute('SELECT * FROM products');
    console.table(rows);
}

// Add a new product
async function addProduct(name, description, price, stock, category, barcode, status) {
    await connection.execute('INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, description, price, stock, category, barcode, status]);
    console.log('Produit ajouté avec succès.');
}

// Update an existing product
async function updateProduct(id, name, description, price, stock, category, barcode, status) {
    await connection.execute('UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?', [name, description, price, stock, category, barcode, status, id]);
    console.log('Produit mis à jour avec succès.');
}

// Delete a product
async function deleteProduct(id) {
    await connection.execute('DELETE FROM products WHERE id = ?', [id]);
    console.log('Produit supprimé avec succès.');
}

module.exports = { listProducts, addProduct, updateProduct, deleteProduct };
