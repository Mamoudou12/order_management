# Order Management System
## Description
Le projet Order Management System est une application Node.js permettant de gérer les commandes, clients, et paiements. L'application utilise une base de données MySQL pour stocker les données et propose des fonctionnalités CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les clients, les commandes et les paiements.

## Fonctionnalités
- Clients : Ajouter, lister, mettre à jour et supprimer des clients.
- Commandes : Gérer les commandes des clients, incluant l'ajout, la mise à jour, la suppression et la consultation des commandes.
- Paiements : Gestion des paiements associés aux commandes.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- Node.js (version 14 ou supérieure)
- MySQL
- npm (inclus avec Node.js)

## Installation
1. Clonez le dépôt :
```bash
git clone https://github.com/Mamoudou12/order_management.git
```
```bash
cd order_management
```

2. Installez les dépendances :
```bash
npm install
```
- Acceder au dossier src:
```bash
cd src
```

3. Configurez la base de données MySQL :
[Lien du script sql](https://drive.google.com/file/d/18su-etmc9z8_-W4Bm5Dkw9NkgnX-Bx4C/view?usp=drive_link)

- Créez une base de données MySQL nommée order_management.

4. Configurez les paramètres de connexion à la base de données :
- Le fichier de configuration de la base de données se trouve à src/db.js.
- Mettez à jour les informations de connexion dans db.js avec vos identifiants MySQL :
```bash
const mysql = require ('mysql2/promise');

const connPool = mysql.createPool({
  host: 'localhost',
  user: 'votre_utilisateur',
  password: 'votre_mot_de_passe',
  database: 'order_management',
  waitForConnections: true,
  connectionLimit: 2,
  connectTimeout: false
});

connPool.getConnection().then(() => {
    console.log("CONNECTED")
})
module.exports = connPool;
```
## Utilisation
### Lancer l'application
Pour démarrer l'application, utilisez la commande suivante :
```bash
node index.js
```

# Auteur
[Mamoudou Adama Ba](https://github.com/Mamoudou12)
