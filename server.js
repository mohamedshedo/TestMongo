const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todo');
const {UserModel}=require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const  {ObjectID} =require('mongodb');


const app = express();
let port = 3000;


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

app.get('/todos',(req,res)=>{

    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    });
});



app.get('/todos/:id',(req,res)=>{

    let id = req.params.id;

    if(ObjectID.isValid(id)){

        
        Todo.findById(id)
        .then((doc)=>{
            if(!doc){return res.status(404).send()}
            res.send(doc);
        })
        .catch((err)=> {
            res.status(404).send(err);
        });
    }else{
        res.status(404).send();
    }

});


app.listen(port,()=>{
    console.log('server connected');
});

module.exports={app};

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