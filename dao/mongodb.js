// Importando el cliente de MongoDB de los módulos.
const MongoClient = require("mongodb").MongoClient;

let db = null;
let client = null;

const getDb = async () => {
  if (db) {
    return db;
  }
  if (!client) {
    client = await MongoClient.connect(process.env.MONGOURIDEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  db = client.db();
  return db;
};

module.exports = getDb;
