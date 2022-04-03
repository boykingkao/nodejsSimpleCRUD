const MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb");
const url = "mongodb://localhost:27017/";

const express = require("express")

const path = require("path")

const app = express()

testPage = path.join(__dirname, "views/path.ejs")

var mongo = require('mongodb');

const gohza = require('./demo_create_mongo_db');
const { render, redirect } = require("express/lib/response");

//อ้างอิงตำแหน่งไฟล์
const gohPage = path.join(__dirname, "./views/goh.html")
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false })) //จะทำให้รับค่าจากฟอร์มที่มี method = post ได้
app.use("/css", express.static(__dirname + "/css")) //จะทำให้สามารถใช้ไฟล์ใน folder /css ได้ (html link css ได้)
app.get("/", (req, res) => {

    MongoClient.connect(url, async function (err, client) {
        var dbo = client.db("gohtest");
        var dbdata = await dbo.collection("users").find({}).sort({ name: -1 }).toArray()
        res.render("index", { name: dbdata })
        client.close()
    })

    console.log("index page!!!")


})

app.get("/user", function (req, res) {
    MongoClient.connect(url, async function (err, client) {
        var dbo = client.db("gohtest");
        var dbdata = await dbo.collection("users").find({}).sort({ name: -1 }).toArray()
        res.render("userList", { name: dbdata })
        client.close()
    })
    console.log("users list page")

})

app.get("/test", (req, res) => {
    res.render("test")
    //res.sendFile(test)
})

app.get("/goh", (req, res) => {
    res.sendFile(gohPage)

})

app.get("/new_collection", function (req, res) {
    var a = ""

    for (var key in req.query) {
        a = a + `${req.query[key]} <br>`
        console.log(req.query[key])
    }
    // gohza.connect_db() เอา comment ออกด้วย
    res.send(`your input data is <br> ${a}`)


})

////////////////////////////////////
app.get("/user/add", function (req, res) {
    res.render('addform')
})

app.post("/insert", function (req, res) {
    res.redirect('/user/add')
    gohza.add_user(req.body.name, req.body.lastname)
    console.log(req.body)
})
////////////////////////////////////

app.get("/user/:id", function (req, res) {
    MongoClient.connect(url, async function (err, client) {
        var dbo = client.db("gohtest");
        var dbdata = await dbo.collection("users").find({ _id: new mongodb.ObjectId(req.params.id) }).sort({ name: -1 }).toArray()
        res.render("user", { data: dbdata })
        console.log(dbdata)
        client.close()
    })

})

app.get("/delete/:id", function (req, res) {

    gohza.delete_user(req.params.id)
    res.redirect("/user")

})

app.post("/user/edit", function (req, res) {
    console.log(req.body)
    res.render("edituser", { data: req.body })

})

app.post("/update", function (req, res) {
    console.log(req.body)
    gohza.update_user(req.body)
    res.redirect("/user")
})

app.listen(3000, () => {
    console.log("started server at port 3000 succeed")
    console.log(__dirname, 'views')
})