const expect = require('expect');
const request = require('supertest');
const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID}=require('mongodb');
const{todos,populateTodos,users,populateUsers}=require('./seed/seed');
const{User}=require('./../models/user');

console.log(process.env.MONGODB_URL);
beforeEach(populateUsers);

beforeEach(populateTodos);

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

});


describe('delete /todos/id:',()=>{

    it("should remove the todo",(done)=>{

        request(app)
        .delete(`/todos/${todos[1]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{

            expect(res.body.text).toBe(todos[1].text);
        })
        .end((err,res)=>{
            if(err){return done(err);}

            Todo.findById(todos[1]._id).then((res)=>{
               expect(res).toBe(null);
               done();
            }).catch((e)=>{
                done(e);
            });
        })
    })
});

describe("patch ",()=>{


    it("should update todo ",(done)=>{

        request(app)
        .patch(`/todos/${todos[0]._id}`)
        .send({"completed":true})
        .expect(200)
        .expect((res)=>{
            expect(res.body.completed).toBe(true)
        }).end(done)
    });

    it('should update todo with false',(done)=>{

        request(app)
        .patch(`/todos/${todos[1]._id}`)
        .send({"text":"new update","completed":false})
        .expect(200)
        .expect((doc)=>{
            expect(doc.body.completed).toBe(false);
            expect(doc.body.completedAt).toNotExist();

        })
        .end(done);
    })
})


    describe('Get/Users/me',()=>{

        it('should return user if authenticated',(done)=>{

            request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
        });

        it('should return 401 when user isnt authenticate',(done)=>{

            request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
        })

        

    })


    describe('post /users',()=>{

        it('should create a user',(done)=>{
            let email='example@example.com';
            let password ='1234546';
            request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            }).end((err)=>{
                if(err){return done(err)}

                User.find({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
        });
        it('should not create user if email in use',(done)=>{
                request(app)
                .post('/users')
                .send({email:users[0].email,password:users[0].password})
                .expect(400)
                .end(done)


        });

        it('should return validation errors if request is invalid',(done)=>{
                request(app)
                .post('/users')
                .send({email:'nfkjdnf',password:'213'})
                .expect(400)
                .end(done)
        });
    });

    describe('Post /users/login',()=>{
        it("should login user and return auth token",(done)=>{
            request(app)
            .post('/users/login')
            .send({email:users[1].email,password:users[1].password})
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err){ return done(err);}
                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[0]).toInclude({
                        access:'auth',
                        token:res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>done(e));
            });
        });

        it('should reject invaild login',(done)=>{
            request(app)
            .post('/users/login')
            .send({email:users[1].email,password:"123456789"})
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err,res)=>{
                if(err){return done(err);}
                User.findById(users[1]._id).then((res)=>{
                    expect(res.tokens.length).toEqual(0);
                    done();
                }).catch((err)=>done(err));

            })
        });
    });

    describe("Delete /users/me/token",()=>{

        it('should remove auth token',(done)=>{
            request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err)=>done(err));
            });
        });
    });