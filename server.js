const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todo');
const {UserModel}=require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
let port = process.env.PORT||3000;


app.use(bodyParser.json());

app.post('/todos',(req ,res)=>{

 let newTodo = new Todo({
     text:req.body.text
 });

 newTodo.save().then((doc)=>{
     res.send(doc);
 }).catch((err)=>{
     res.status(400).send(err);
 });
    console.log(req.body);
});



app.listen(port,()=>{
    console.log('server connected');
});



/*
let newTodo= new Todo({
 
   
});

newTodo.save().then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});


let newUser= new UserModel(
    {username:"mahmhhd",password:"0123454",email:"shedp"}
);

newUser.save().then(
    (doc)=>{
        console.log(doc);
    }
).catch((err)=>{
    console.log('cant insert');
});
*/