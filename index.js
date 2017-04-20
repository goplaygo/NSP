let path = require('path');
let express = require('express');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash');
let config = require('config-lite');
let routes = require('./routes');
let pkg = require('./package');

let winston = require('winston');
let expressWinston = require('express-winston');

let app = express();


//设置模板目录
app.set('views',path.join(__dirname,'views'));
//设置模板为ejs
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')));
//session中间件
app.use(session({
    name:config.session.key,//设置cookie中保存的sessionId是字段名称
    secret: config.session.secret,//通过设置secret来计算hash值并放在cookie中，使产生signedCookie防篡改
    resave: true,//强制刷新session
    saveUninitialized: false,//设置false，强制创建一个session，即使用户未登陆
    cookie:{
        maxAge:config.session.maxAge//过期时间，过期后cookie中的sessionId自动删除
    },
    store:new MongoStore({//将session存储到mongodb
        url: config.mongodb//mongodb地址
    })
}));
//flash中间件，用来显示通知
 app.use(flash());
//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),//上传文件的目录
    keepExtensions:true//保留后缀
}));

 //设置模板全局变量
app.locals.Share= {
    title: pkg.name,
    description: pkg.description
};
//添加模板必须的三个变量
app.use(function (req,res,next){
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//正常请求的日志
//路由
routes(app);
//错误请求的日志
//error page
app.use(function (err, req, res, next) {
    res.render('error',{
        error: err
    });
});

if(module.parent){
    module.exports = app;
} else {
    //监听端口，启动程序
    app.listen(config.port,function () {
        console.log(`${pkg.name} listening on port ${config.port}`);
    });
}