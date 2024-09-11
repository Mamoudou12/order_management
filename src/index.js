const connection = require('./db'); // Assurez-vous que ce fichier configure et exporte votre connexion MySQL
const readlineSync = require('readline-sync');
const customer = require('./customers');
const product = require('./products');
const order = require('./orders'); // Importer le module des commandes
const payment = require('./payments');

// Fonction principale du menu
async function mainMenu() {
    console.log('\n=== Menu Principal ===');
    console.log('1. Gestion des Clients');
    console.log('2. Gestion des Produits');
    console.log('3. Gestion des Commandes');
    console.log('4. Gestion des Paiements');
    console.log('0. Quitter');

    const choice = readlineSync.question('Choisissez une option : ');

    switch (choice) {
        case '1':
            await customerMenu();
            break;
        case '2':
            await productMenu();
            break;
        case '3':
            await orderMenu(); // Appeler le menu des commandes
            break;
        case '4':
            await paymentMenu(); // Appeler le menu des paiements
            break;
        case '0':
            console.log('Au revoir !');
            return;
        default:
            console.log('Option invalide. Veuillez choisir à nouveau.');
    }

    // Revenir au menu principal
    await mainMenu();
}

// Menu pour la gestion des clients
async function customerMenu() {
    console.log('\n=== Gestion des Clients ===');
    console.log('1. Lister les clients');
    console.log('2. Ajouter un client');
    console.log('3. Mettre à jour un client');
    console.log('4. Supprimer un client');
    console.log('0. Retour au menu principal');

    const choice = readlineSync.question('Choisissez une option : ');

    switch (choice) {
        case '1':
            await customer.listCustomers();
            break;
        case '2':
            const name = readlineSync.question('Nom : ');
            const address = readlineSync.question('Adresse : ');
            const email = readlineSync.question('Email : ');
            const phone = readlineSync.question('Téléphone : ');
            await customer.addCustomer(name, address, email, phone);
            break;
        case '3':
            const idUpdate = readlineSync.question('ID du client à mettre à jour : ');
            const nameUpdate = readlineSync.question('Nouveau nom : ');
            const addressUpdate = readlineSync.question('Nouvelle adresse : ');
            const emailUpdate = readlineSync.question('Nouvel email : ');
            const phoneUpdate = readlineSync.question('Nouveau téléphone : ');
            await customer.updateCustomer(idUpdate, nameUpdate, addressUpdate, emailUpdate, phoneUpdate);
            break;
        case '4':
            const idDelete = readlineSync.question('ID du client à supprimer : ');
            await customer.deleteCustomer(idDelete);
            break;
        case '0':
            return;
        default:
            console.log('Option invalide. Veuillez choisir à nouveau.');
    }

    await customerMenu();
}

// Menu pour la gestion des produits
async function productMenu() {
    console.log('\n=== Gestion des Produits ===');
    console.log('1. Lister les produits');
    console.log('2. Ajouter un produit');
    console.log('3. Mettre à jour un produit');
    console.log('4. Supprimer un produit');
    console.log('0. Retour au menu principal');

    const choice = readlineSync.question('Choisissez une option : ');

    switch (choice) {
        case '1':
            await product.listProducts();
            break;
        case '2':
            const name = readlineSync.question('Nom : ');
            const description = readlineSync.question('Description : ');
            const price = readlineSync.question('Prix : ');
            const stock = readlineSync.question('Stock : ');
            const category = readlineSync.question('Catégorie : ');
            const barcode = readlineSync.question('Code-barres : ');
            const status = readlineSync.question('Statut : ');
            await product.addProduct(name, description, price, stock, category, barcode, status);
            break;
        case '3':
            const idUpdate = readlineSync.question('ID du produit à mettre à jour : ');
            const nameUpdate = readlineSync.question('Nouveau nom : ');
            const descriptionUpdate = readlineSync.question('Nouvelle description : ');
            const priceUpdate = readlineSync.question('Nouveau prix : ');
            const stockUpdate = readlineSync.question('Nouveau stock : ');
            const categoryUpdate = readlineSync.question('Nouvelle catégorie : ');
            const barcodeUpdate = readlineSync.question('Nouveau code-barres : ');
            const statusUpdate = readlineSync.question('Nouveau statut : ');
            await product.updateProduct(idUpdate, nameUpdate, descriptionUpdate, priceUpdate, stockUpdate, categoryUpdate, barcodeUpdate, statusUpdate);
            break;
        case '4':
            const idDelete = readlineSync.question('ID du produit à supprimer : ');
            await product.deleteProduct(idDelete);
            break;
        case '0':
            return;
        default:
            console.log('Option invalide. Veuillez choisir à nouveau.');
    }

    await productMenu();
}

// Menu pour la gestion des commandes
async function orderMenu() {
    console.log('\n=== Gestion des Commandes ===');
    console.log('1. Lister les commandes d\'achat');
    console.log('2. Lister les détails d\'une commande');
    console.log('3. Ajouter une commande d\'achat');
    console.log('4. Mettre à jour une commande d\'achat');
    console.log('5. Supprimer une commande d\'achat');
    console.log('6. Mettre à jour les détails d\'une commande');
    console.log('0. Retour au menu principal');

    const choice = readlineSync.question('Choisissez une option : ');

    switch (choice) {
        case '1':
            await order.listPurchaseOrders();
            break;
        case '2':
            const orderId = readlineSync.question('ID de la commande pour laquelle lister les détails : ');
            await order.listOrderDetails(orderId);
            break;
        case '3':
            const date = readlineSync.question('Date (YYYY-MM-DD) : ');
            const delivery_address = readlineSync.question('Adresse de livraison : ');
            const track_number = readlineSync.question('Numéro de suivi : ');
            const status = readlineSync.question('Statut : ');
            const customer_id = readlineSync.question('ID du client : ');
            
            // Obtenir les détails de la commande
            const order_details = [];
            let addMoreDetails;
            do {
                const quantity = readlineSync.question('Quantité : ');
                const price = readlineSync.question('Prix : ');
                const product_id = readlineSync.question('ID du produit : ');
                order_details.push({ quantity, price, product_id });
                addMoreDetails = readlineSync.keyInYNStrict('Ajouter un autre détail de commande ?');
            } while (addMoreDetails);

            await order.addPurchaseOrder(date, delivery_address, track_number, status, customer_id, order_details);
            break;
        case '4':
            const idUpdate = readlineSync.question('ID de la commande d\'achat à mettre à jour : ');
            const dateUpdate = readlineSync.question('Nouvelle date (YYYY-MM-DD) : ');
            const delivery_addressUpdate = readlineSync.question('Nouvelle adresse de livraison : ');
            const track_numberUpdate = readlineSync.question('Nouveau numéro de suivi : ');
            const statusUpdate = readlineSync.question('Nouveau statut : ');
            const customer_idUpdate = readlineSync.question('Nouvel ID du client : ');
            await order.updatePurchaseOrder(idUpdate, dateUpdate, delivery_addressUpdate, track_numberUpdate, statusUpdate, customer_idUpdate);
            break;
        case '5':
            const idDelete = readlineSync.question('ID de la commande d\'achat à supprimer : ');
            await order.deletePurchaseOrder(idDelete);
            break;
            case '6':
            const updateOrderId = readlineSync.question('ID de la commande pour mettre à jour les détails : ');
            const detailId = readlineSync.question('ID du détail à mettre à jour : ');
            const newQuantity = readlineSync.question('Nouvelle quantité : ');
            const newPrice = readlineSync.question('Nouveau prix : ');
            const newProductId = readlineSync.question('Nouvel ID produit : ');
            await order.updateOrderDetails(updateOrderId, detailId, newQuantity, newPrice, newProductId);
            break;
        case '0':
            return;
        default:
            console.log('Option invalide. Veuillez choisir à nouveau.');
    }

    await orderMenu();
}

// Menu pour la gestion des paiements
async function paymentMenu() {
    console.log('\n=== Gestion des Paiements ===');
    console.log('1. Lister les paiements');
    console.log('2. Ajouter un paiement');
    console.log('3. Mettre à jour un paiement');
    console.log('4. Supprimer un paiement');
    console.log('0. Retour au menu principal');
  
    const choice = readlineSync.question('Choisissez une option : ');
  
    switch (choice) {
      case '1':
        await payment.listPayments();
        break;
      case '2':
        const amount = readlineSync.question('Montant : ');
        const paymentDate = readlineSync.question('Date du paiement (YYYY-MM-DD) : ');
        const paymentMethod = readlineSync.question('Méthode de paiement : ');
        const orderId = readlineSync.question('ID de la commande : ');
        await payment.addPayment(paymentDate, amount, paymentMethod, orderId);
        break;
      case '3':
        const idUpdate = readlineSync.question('ID du paiement à mettre à jour : ');
        const newAmount = readlineSync.question('Nouveau montant : ');
        const newPaymentDate = readlineSync.question('Nouvelle date du paiement (YYYY-MM-DD) : ');
        const newPaymentMethod = readlineSync.question('Nouvelle méthode de paiement : ');
        const newOrderId = readlineSync.question('Nouvel ID de la commande : ');
        await payment.updatePayment(idUpdate, newPaymentDate, newAmount, newPaymentMethod, newOrderId);
        break;
      case '4':
        const idDelete = readlineSync.question('ID du paiement à supprimer : ');
        await payment.deletePayment(idDelete);
        break;
      case '0':
        return;
      default:
        console.log('Option invalide. Veuillez choisir à nouveau.');
    }
  
    await paymentMenu();
  }
  
//   paymentMenu();

// Lancer le menu principal
mainMenu();
