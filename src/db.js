const mysql = require ('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const connPool = mysql.createPool({
  host: 'localhost',
  user: 'test_user',
  password: 'password123',
  database: 'order_management',
  waitForConnections: true,
  connectionLimit: 100,
  connectTimeout: false
});

connPool.getConnection().then(() => {
    console.log("CONNECTED")
})
module.exports = connPool;