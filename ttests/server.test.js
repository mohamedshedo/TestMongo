const expect = require('expect');
const request = require('supertest');
const {app} = require("./../server");
const {Todo} = require("./../models/todo");


describe('post /todo',()=>{

    it('should create new todo',(done)=>{
            let text='here from supertest';
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
            console.log("hey");
        })
        .end((err,res)=>{
            if(err){return done(err);}

           Todo.findOne({text}).then((res)=>{
               expect(res.text).toBe(text);
                done();
            })
            .catch((e)=>{
                done(e);
             });
        });
    })
});
