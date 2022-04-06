const MongoClient = require('mongodb').MongoClient;
const mongodb = require("mongodb");
const url = "mongodb://localhost:27017/";

const express = require("express")

const path = require("path")

const app = express()

const fs = require("fs"); // for delete file
///////////////////////////// upload profile

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/profiles')
    },
    filename: (req, file, cb) => {
        cb(null, 'profile_' + Date.now() + ".jpg")
    }
})
const upload = multer({ storage: storage })
/////////////////////////////

testPage = path.join(__dirname, "views/path.ejs")



const gohza = require('./demo_create_mongo_db');

//อ้างอิงตำแหน่งไฟล์
const gohPage = path.join(__dirname, "./views/goh.html")
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false })) //จะทำให้รับค่าจากฟอร์มที่มี method = post ได้
app.use("/css", express.static(__dirname + "/css")) //จะทำให้สามารถใช้ไฟล์ใน folder /css ได้ (html link css ได้)
app.use('/images', express.static(__dirname + "/images"))



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

app.post("/insert", upload.single('profile_image'), function (req, res) {
    res.redirect('/user/add')
    gohza.add_user(req.body.name, req.body.lastname, req.file.filename)
    console.log(req.file.filename)
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
    //ลบไฟล์ เพื่อทำให้ไม่เปลืองพื้นที่
    try {
        fs.unlinkSync(`./images/profiles/${req.query.profile_image}`)
    } catch(err){
        console.log(err)
    }
    console.log(req.query.profile_image)
    gohza.delete_user(req.params.id)
    res.redirect("/user")

})

app.post("/user/edit", function (req, res) {
    console.log(req.body)
    console.log(`=======================`)
    res.render("edituser", { data: req.body })

})

app.post("/update",upload.single('profile_image'), function (req, res) {
    try{
        var profile_image = req.file.filename
        try {
            fs.unlinkSync(`./images/profiles/${req.body.profile_image_old}`)
        } catch(err){
            console.log(err)
        }
        
    }catch(err){
        console.log("you didn't change profile unage")
        var profile_image = req.body.profile_image_old
        console.log("old file is : " + profile_image)
    }
    
 
    gohza.update_user(req.body, profile_image) //เปลี่ยนข้อมูลของ user
    res.redirect("/user")
})

app.listen(3000, () => {
    console.log("started server at port 3000 succeed")
    console.log(__dirname, 'views')
    console.log("http://localhost:3000/")
})