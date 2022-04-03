const MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb");
const url = "mongodb://localhost:27017/";


function connect_db() {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    var dbo = client.db("gohtest");
    dbo.createCollection("testCreatecollection", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

function add_user(name, lastname) {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log("Database connected...");
    //db.clsoe();

    var dbo = client.db("gohtest"); //ชื่อ collection
    var obj = { name: `${name}`, lastname: `${lastname}` }
    dbo.collection("users").insertOne(obj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    })
  })
}


function delete_user(user_id) {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;

    var dbo = client.db("gohtest")

    var query = { _id: new mongodb.ObjectId(user_id) }

    dbo.collection("users").deleteOne(query, function (err, obj) {
      if (err) throw err
      console.log("1 document deleted")
      console.log(query)

    })
  })
}

function update_user(user) {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;

    var dbo = client.db("gohtest")

    var query = { _id: new mongodb.ObjectId(user._id) }
    var new_value = { $set: { name: user.name, lastname: user.lastname } }

    dbo.collection("users").updateOne(query, new_value, function (err, obj) {
      if (err) throw err
      console.log("1 document updated")
      console.log(query)

    })
  })
}


add = (x, y) => x + y

module.exports.connect_db = connect_db
module.exports.add_user = add_user
module.exports.add = add
module.exports.delete_user = delete_user
module.exports.update_user = update_user
