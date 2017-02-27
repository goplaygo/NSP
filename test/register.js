let path = require('path');
let assert = require('assert');
let request= require('supertest');
let app = require('../index');
let User = require('../lib/mongo').User;

let testName1 = 'testName1';
let testName2 = 'lyk';
descript('register',function () {
    descript('POST /register',function () {
        let agent =require.agent(app);
        beforeEach(function (done) {
            //创建一个用户
            User.create({
                name : testName1,
                password : '123123',
                avatar: '',
                gender: 'x',
                bio:'asdadada'
            })
                .exec()
                .then(function () {
                    done();
                })
                .catch(done)
        });
        afterEach(function (done) {
            //删除测试用户
            User.remove({name:{$in:[testName1,testName2]}})
                .exec()
                .then(function () {
                    done();
                })
                .catch(done);
        });
        //在用户吗错误的情况下
        it('wrong name',function (done) {
            agent
                .post('/register')
                .type('form')
                .attach('avatar',patt.join(__dirname,'avatar.png'))
                .field({name:''})
                .redirects()
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.text.macth(/名字限制在1-10字符内/));
                    done()
                });
        });
        //性别错误的情况下
        it('wrong gender',function (done) {
            agen
                .post('/register')
                .type('form')
                .attach('avatar',patt.join(__dirname,'avatar.png'))
                .field({name:testName2,gender:'a'})
                .redirects()
                .end(function (err, res) {
                    if(err) return done(err);
                    assert(res.text.match(/性别只能是m，f或x/));
                    done();
                });
        });
        //用户名被占用的情况下
        it('duplicate name',function (done) {
            agen
                .post('/register')
                .type('form')
                .attach('avatar',patt.join(__dirname,'avatar.png'))
                .field({name:testName1,gender:'m',bio:'noder',password:'123123',repassword:'123123'})
                .redirects()
                .end(function (err, res) {
                    if(err) return done(err);
                    assert(res.text.match(/用户名已经被占用/));
                    done();
                });
        });
        //注册成功的情况下
        it('success',function (done) {
            agen
                .post('/register')
                .type('form')
                .attach('avatar',patt.join(__dirname,'avatar.png'))
                .field({name:testName2,gender:'m',bio:'noder',password:'123123',repassword:'123123'})
                .redirects()
                .end(function (err, res) {
                    if(err) return done(err);
                    assert(res.text.match(/注册成功/));
                    done();
                });
        });
    });
});