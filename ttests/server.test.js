const expect = require('expect');
const request = require('supertest');
const {app} = require("./../server");
const {Todo} = require("./../models/todo");

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
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
            console.log("hey");
        })
        .end((err,res)=>{
            if(err){return done(err);}

           Todo.find().then((res)=>{
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

            done();
        })
    })
});
