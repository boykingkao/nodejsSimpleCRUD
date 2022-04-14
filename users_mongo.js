const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/mydb"

mongoose.connect(url,{
 
}).catch(err=>console.log("เชิ่อมต่อmongodb ไม่ได้"))

let userSchema = new mongoose.Schema({
    name:String,
    lastname:String,
    profile_image:String
}, { versionKey: false });

let User = mongoose.model("user",userSchema);



module.exports = User