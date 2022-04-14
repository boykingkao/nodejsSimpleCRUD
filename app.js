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

const User = require("./users_mongo");


//อ้างอิงตำแหน่งไฟล์
const gohPage = path.join(__dirname, "./views/goh.html")
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false })) //จะทำให้รับค่าจากฟอร์มที่มี method = post ได้
app.use("/css", express.static(__dirname + "/css")) //จะทำให้สามารถใช้ไฟล์ใน folder /css ได้ (html link css ได้)
app.use('/images', express.static(__dirname + "/images"))



app.get("/", (req, res) => {

    MongoClient.connect(url, async function (err, client) {
        var dbo = client.db("mydb");
        var dbdata = await dbo.collection("users").find({}).sort({ name: -1 }).toArray()
        res.render("index", { name: dbdata })
        client.close()
    })

    console.log("index page!!!")


})

app.get("/user", async function (req, res) {

    const data = await User.find().sort({ name: -1 });
    res.render("userList", { name: data })

    console.log("users list page")

})

app.get("/test", (req, res) => {
    let data = new User({
        name: "testName",
        lastname: "testLastname",
        profile_image: "testImage"
    });

    data.save()
    res.render("index")

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

    res.send(`your input data is <br> ${a}`)


})

app.get("/user/add", function (req, res) {
    res.render('addform')
})

app.post("/insert", upload.single('profile_image'), function (req, res) {
    let data = new User({
        name: req.body.name,
        lastname: req.body.lastname,
        profile_image: req.file.filename
    });
    data.save()

    console.log(req.file.filename)

    res.redirect('/user/add')
})


app.get("/user/:id", async function (req, res) {

    User_data = await User.find({ _id: req.params.id })
    res.render("user", { data: User_data })

})

app.get("/delete/:id", async function (req, res) {
    //ลบไฟล์ เพื่อทำให้ไม่เปลืองพื้นที่
    try {
        fs.unlinkSync(`./images/profiles/${req.query.profile_image}`)
    } catch (err) {
        console.log(err)
    }
    console.log(req.query.profile_image)

    await User.findByIdAndDelete(req.params.id)
    res.redirect("/user")

})

app.post("/user/edit", function (req, res) {
    console.log(req.body)
    console.log(`=======================`)
    res.render("edituser", { data: req.body })

})

app.post("/update", upload.single('profile_image'), async function (req, res) {
    try {
        var profile_image = req.file.filename
        try {
            fs.unlinkSync(`./images/profiles/${req.body.profile_image_old}`)
        } catch (err) {
            console.log(err)
        }

    } catch (err) {
        console.log("you didn't change profile unage")
        var profile_image = req.body.profile_image_old
        console.log("old file is : " + profile_image)
    }

    let data = ({
        name: req.body.name,
        lastname: req.body.lastname,
        profile_image: profile_image
    })
    console.log(data)
    await User.updateOne({ _id: req.body._id }, data)

    res.redirect("/user")
})

app.get("/about_me", (req, res) => {
    res.render("aboutMe")
})

app.listen(3000, () => {
    console.log("started server at port 3000 succeed")
    console.log("http://localhost:3000/")
})