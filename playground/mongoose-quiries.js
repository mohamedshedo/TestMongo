const {mongoose}= require('./../db/mongoose');
const {Todo}=require('./../models/todo');
const {ObjectID}=require('mongodb');
let id = '5b58f79c5768814050622be7';
/*
Todo.find({_id:id})
.then((doc)=>{
    console.log(doc);
});

Todo.findOne({_id:id})
.then((doc)=>{
    console.log(doc);
});
*/

if(!ObjectID.isValid(id)){
    console.log('id is not valid');
};
Todo.findById(id)
.then((doc)=>{
    console.log(doc);
});

