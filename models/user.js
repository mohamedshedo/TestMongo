const mongoose=require('mongoose');
const validator = require('validator');
const jwt =require('jsonwebtoken');
const _= require('lodash');
const bcrypt =require('bcryptjs');
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

NewUserSchema.statics.findByToken=function(token){
    let User=this;
    let decoded;
    try{
        decoded= jwt.verify(token,'abc123');
    }catch(e){
        return new Promise((resolve,reject)=>{
            reject();
        });

        //return promise.reject
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}
NewUserSchema.methods.removeToken=function(token){
    let user=this;

  return  user.update({
        $pull:{
            tokens:{token}
        }
    });
};
NewUserSchema.methods.generateAuthToken = function(){
    let user=this;
    let access='auth';
    let token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});
   return user.save().then((result) => {
        return token;
    });
};

NewUserSchema.statics.findByCredentials=function(email,password){
    let User=this;

 return User.findOne({email}).then((user)=>{
        if(!user){return Promise.reject();}

        return new Promise((resolve,reject)=>{

            bcrypt.compare(password,user.password,(err,success)=>{
                if(success){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
};


NewUserSchema.pre('save',function(next){

    let user = this;

    if(user.isModified('password')){
        
        bcrypt.genSalt(10,(err,salt)=>{
            
            bcrypt.hash(user.password,salt,(err,hash)=>{
            
                user.password=hash;
                next();
            });
        });

    }else{
    next();
}
});

let UserModel = mongoose.model("Users",UserSchemz);

let User = mongoose.model('User',NewUserSchema);
module.exports={UserModel,User};