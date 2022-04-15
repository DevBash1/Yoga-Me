let NoDB = require("/Assets/dist/nodb.js");

let db = new NoDB({
    database: "YogaDB",
    path: "YogaDB.nodb",
    encrypt: false,
});

// Create Required Tables 

db.query("CREATE TABLE user(name,gender,profile,age) IF NOT EXISTS")

db.query("CREATE TABLE levels(level,date,completed)")

module.exports = db;