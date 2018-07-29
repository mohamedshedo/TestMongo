const mongoose=require('mongoose');
const validator = require('validator');
const jwt =require('jsonwebtoken');
const _= require('lodash');
let UserSchemz= mongoose.Schema({
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

let NewUserSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        minlength:1,
        required:true,
        trim:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{value} is not a valid mail'
        }

    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{type:String,required:true},
        token:{type:String,required:true}
    }]
});

NewUserSchema.methods.toJSON=function(){
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,["_id","email"]);
}


NewUserSchema.methods.generateAuthToken = function(){
    let user=this;
    let access='auth';
    let token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
   return user.save().then((result) => {
        return token;
    });
};

let UserModel = mongoose.model("Users",UserSchemz);

let User = mongoose.model('User',NewUserSchema);
module.exports={UserModel,User};