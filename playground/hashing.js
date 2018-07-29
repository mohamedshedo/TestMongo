const {SHA256}= require('crypto-js');
const jwt = require('jsonwebtoken');
/*
let message = "I am user number 3";
let hash = SHA256(message).toString();
console.log(hash);
var token ={
    data,
    hash:SHA256(JSON.stringify(data)+'somesecret').toString();
};*/
var data = {
id:10
};

let token = jwt.sign(data,'123abc');
let decoded=jwt.verify(token,'123abc');
console.log(token);
console.log(decoded);

