const {MongoClient,ObjectID }= require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
    
    if(err){return console.log("unenable to connect");}

    console.log('connected to mongodb');

  /*  db.collection('Todos').insertOne({text:"yala bena", completed:false},(err,result)=>{
        if(err){
            return console.log("unenable to insert");
        }

        console.log(JSON.stringify(result.ops,undefined,2));
    });
*/
/*
    db.collection('Todos').find({_id:new ObjectID("5b4f8474d03572af064bbc03")}).toArray().then((res)=>{
        console.log(JSON.stringify( res,undefined,2));
    }).catch((err)=>{console.log("unable to find");});
*/
/*
    db.collection('Users').insertOne({name:"shedo",age:22,location:'Egypt'},(err,res)=>{
        if(err){return console.log('cant insert');}

        console.log(`inserted successfully ${JSON.stringify(res.ops)}`);
    });
    
   db.collection('Users').find({name:'shedo'}).count().then((count)=>{
    console.log(count);
}).catch((err)=>{console.log("unable to find");});
*/
/*
db.collection('Todos').deleteOne({completed:false}).then((result)=>{})
*/
    db.close();

});

