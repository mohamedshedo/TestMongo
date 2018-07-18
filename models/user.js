const mongoose=require('mongoose');
let UserModel = mongoose.model("Users",{
    username:{
        type:String,
        required:true,
       minlength:5
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    email:{
        type:String,
        default:"NONE"
    }


});
module.exports={UserModel};