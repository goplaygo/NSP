module.exports = function (app) {
    app.get('/',function (req, res) {
        res.redirect('/posts');
    });
    app.use('/register',require('./register'));
    app.use('/signin',require('./signin'));
    app.use('/signout',require('./signout'));
    app.use('/posts',require('./posts'));
    //404页面
    app.use(function (req, res) {
        if(!res.headersSent){
           res.render('404');
        }
    });
};
