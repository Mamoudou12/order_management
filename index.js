// index.js
const readlineSync = require('readline-sync');
const { listCustomers, addCustomer, updateCustomer, deleteCustomer } = require('./customers');

async function mainMenu() {
  console.log('\n=== Gestion des Commandes ===');
  console.log('1. Lister les clients');
  console.log('2. Ajouter un client');
  console.log('3. Mettre à jour un client');
  console.log('4. Supprimer un client');
  console.log('0. Quitter');
  
  const choice = readlineSync.question('Choisissez une option : ');

  switch (choice) {
    case '1':
      await listCustomers();
      break;
    case '2':
      const name = readlineSync.question('Nom : ');
      const address = readlineSync.question('Adresse : ');
      const email = readlineSync.question('Email : ');
      const phone = readlineSync.question('Téléphone : ');
      await addCustomer(name, address, email, phone);
      break;
    case '3':
      const idUpdate = readlineSync.question('ID du client à mettre à jour : ');
      const nameUpdate = readlineSync.question('Nouveau nom : ');
      const addressUpdate = readlineSync.question('Nouvelle adresse : ');
      const emailUpdate = readlineSync.question('Nouvel email : ');
      const phoneUpdate = readlineSync.question('Nouveau téléphone : ');
      await updateCustomer(idUpdate, nameUpdate, addressUpdate, emailUpdate, phoneUpdate);
      break;
    case '4':
      const idDelete = readlineSync.question('ID du client à supprimer : ');
      await deleteCustomer(idDelete);
      break;
    case '0':
      console.log('Au revoir!');
      process.exit(0);
    default:
      console.log('Option invalide. Veuillez choisir à nouveau.');
  }

  mainMenu();
}

mainMenu();
