const {SHA256}= require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


let passwrod='123abc'

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(passwrod,salt,(err,hash)=>{
    console.log(hash);
    });
});
let hashedpassword='$2a$10$RaO8LUOQAusAhs6D7T5ff.m9GIQgGKIRra9i84NqU8c9DCc/ogVmC';
bcrypt.compare(passwrod,hashedpassword,(err,res)=>{
    console.log(res);
});
/*
let message = "I am user number 3";
let hash = SHA256(message).toString();
console.log(hash);
var token ={
    data,
    hash:SHA256(JSON.stringify(data)+'somesecret').toString();
};
var data = {
id:10
};

let token = jwt.sign(data,'123abc');
let decoded=jwt.verify(token,'123abc');
console.log(token);
console.log(decoded);
*/
