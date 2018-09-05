
require('./config/config.js');
const {mongoose}=require('./db/mongoose');
const {Todo}=require('./models/todo');
const {UserModel,User}=require('./models/user');
const express = require('express');
const bodyParser = require('body-parser');
const  {ObjectID} =require('mongodb');
const _=  require('lodash');
const{authenticate}=require('./middleware/authenticate');
const bycrypt= require('bcryptjs');
const app = express();
let port = process.env.PORT;



app.use(bodyParser.json());

app.post('/todos',authenticate,(req ,res)=>{

 let newTodo = new Todo({
     text:req.body.text,
     _creator:req.user._id
 });

 newTodo.save().then((doc)=>{
     res.send(doc);
 }).catch((err)=>{
     res.status(400).send(err);
 });

});

app.get('/todos',authenticate,(req,res)=>{

    Todo.find({_creator:req.user._id}).then((todos)=>{
        res.send({todos});
    }).catch((err)=>{
        res.status(400).send(err);
    });
});

app.delete('/todos/:id',authenticate,(req,res)=>{

    if(!ObjectID.isValid(req.params.id)){
        console.log('1');
        return res.status(404).send();
    }

    Todo.findOneAndRemove({_id:req.params.id,_creator:req.user._id})
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

app.post('/users/login',(req,res)=>{

    let body = _.pick(req.body,["email","password"]);

    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        });
    }).catch((e)=>{
        res.status(400).send();
    })
        
});

app.delete('/users/me/token',authenticate,(req,res)=>{

    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch(()=>{res.status(400).send();});
});

app.get('/users/me',authenticate,(req,res)=>{
   res.send(req.user);
});
app.get('/todos/:id',authenticate,(req,res)=>{

    let id = req.params.id;

    if(ObjectID.isValid(id)){

        
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    })
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

app.patch('/todos/:id',authenticate,(req,res)=>{

    let id = req.params.id;
   
    let body =_.pick(req.body,["text","completed"]);
  
    if(!ObjectID.isValid(id)){return res.status(404).send();}

    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt=new Date().getTime();
        
    }else{
        body.completed=false;
        body.completedAt=null;
    }
    
        Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{ $set: body}, { new: true }).then((doc)=>{
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