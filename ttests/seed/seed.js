const {ObjectID}=require('mongodb');
const{Todo}=require('./../../models/todo');
const{User}=require('./../../models/user');
const jwt =require('jsonwebtoken');
const userOneID=new ObjectID();
const userTwoId= new ObjectID();
const users = [
    {
        _id:userOneID,
        email:'andrew@example.com',
        password:'userOnePass',
        tokens:[
            {
                access:'auth',
                token: jwt.sign({_id:userOneID,access:'auth'},'abc123').toString()
            }
        ]
    },{
        _id:userTwoId,
        email:'jen@example.com',
        password:'userTwoPass',
        tokens:[
            {
                access:'auth',
                token: jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
            }
        ]
    }];
const todos = [{
    _id:new ObjectID(),
    text:'first test todo',
    completed:false,
    completedAt:null,
    _creator:userOneID
},{
    _id:new ObjectID(),
    text:'second test todo',
    completed:true,
    completedAt:333,
    _creator:userTwoId
}];

const populateTodos=function(done){
    this.timeout(5000); // override default 2000 ms
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then((docs)=>{
        done();
    });
};

const populateUsers=function(done){
    this.timeout(5000);

    User.remove({}).then(()=>{
        let userOne= new User(users[0]).save();
        let userTwo=new User(users[1]).save();
     return   Promise.all([userOne,userTwo])
    }).then(()=> done())
}

module.exports={populateTodos,todos,users,populateUsers};

