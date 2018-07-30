
let env=process.env.NODE_ENV || 'development';
console.log(env);
if(env==='development'){
    process.env.PORT=3000;
    process.env.MONGODB_URL="mongodb://localhost:27017/TodoApp";
}else if (env ==='test'){
    process.env.PORT=3000;
    process.env.MONGODB_URL="mongodb://localhost:27017/TodoAppTest";
}
const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todo');
const {UserModel,User}=require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const  {ObjectID} =require('mongodb');
const _=  require('lodash');
const{authenticate}=require('./middleware/authenticate');
const app = express();
let port = process.env.PORT;



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

});

app.get('/todos',(req,res)=>{

    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.delete('/todos/:id',(req,res)=>{

    if(!ObjectID.isValid(req.params.id)){
        console.log('1');
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(req.params.id)
    .then((doc)=>{
        if(!doc){return res.status(404).send();}
        res.send(doc);
    })
    .catch((err)=>{
        res.status(404).send(err);
    })
})

app.post('/users',(req,res)=>{
    let reqBody= _.pick(req.body,['email','password']);

    let newUser= new User({
        email:reqBody.email,
        password:reqBody.password
    });

    newUser.save().then((doc)=>{
        return newUser.generateAuthToken();
    }).then((token)=>{
        
        res.header('x-auth',token).send(newUser);
    }).catch((e)=>{
       
        res.status(400).send(e);
    });
});



app.get('/users/me',authenticate,(req,res)=>{
   res.send(req.user);
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

app.patch('/todos/:id',(req,res)=>{

    let id = req.params.id;
   
    let body =_.pick(req.body,["text","completed"]);
  
    if(!ObjectID.isValid(id)){return res.status(404).send();}

    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt=new Date().getTime();
        
    }else{
        body.completed=false;
        body.completedAt=null;
    }
    
        Todo.findByIdAndUpdate(id,{ $set: body}, { new: true }).then((doc)=>{
            if(!doc){   
                return res.status(404).send();
            }
           
            res.send(doc);
        }).catch((err)=>{
          
            res.status(400).send();
        })
    
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