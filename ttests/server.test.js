const expect = require('expect');
const request = require('supertest');
const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID}=require('mongodb');
const todos = [{
    _id:new ObjectID(),
    text:'first test todo'
},{
    _id:new ObjectID(),
    text:'second test todo'
}];


beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then((docs)=>{
        done();

    });
})
describe('post /todo',()=>{

    it('should create new todo',(done)=>{
            let text='here from supertest';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
          
        })
        .end((err,res)=>{
            if(err){return done(err);}

           Todo.find({text}).then((res)=>{
            expect(res.length).toBe(1);   
            expect(res[0].text).toBe(text);
                done();
            })
            .catch((e)=>{
                done(e);
             });
        });
    });

    it("should not create todo with invalid body",(done)=>{

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err)=>{
            if(err){return done(err);}
            Todo.find().then((doc)=>{
                expect(doc.length).toBe(2);
                done();
            }).catch((err)=>{
                if(err){
            done(err);}
            })
        })
    })
});


describe('Get /todos',()=>{
    it('should get all todos',(done)=>{

        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done)
    })
});

describe('get /todos/id',()=>{

    it('should return todo',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(todos[0].text);
            
        }).end(done);
    });

    it('sould return 404 when id not found',(done)=>{
    request(app)
    .get(`/todos/${new ObjectID()}`)
    .expect(404)
    .end(done)
    });

    it("should return 404 for non object",(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    })

})

