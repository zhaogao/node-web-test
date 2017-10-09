var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var expressLayout = require('express-ejs-layouts');
// var fs = require('fs');
// var mysql  = require('mysql'); 
var mysql = require('promise-mysql');
var db = require('./db');

var redisClient = redis.createClient({
  host:'localhost',
  port:6379,
  // password:''
})

var app = express();
var routes = require('./routes/index');
var user = require('./routes/user');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({ 
    secret: 'iclick2017',
    cookie:{ 
        maxAge: 1000*30*2
    },
    resave: false, 
    saveUninitialized: false,
    store:new RedisStore({
      client:redisClient,
      ttl:1000*30*2
    })
}));

app.use(cookieParser());

//所有请求过来，都去项目当前的public目录下寻找所请求的文件，找到就返回
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
app.use(expressLayout);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.pool = mysql.createPool({     
  host     : 'localhost',       
  user     : 'root',              
  password : '',       
  port: '3306',                   
  database: 'test', 
}); 

var white_path = ['/','/reg'];

var isLogin = function(req,res,next){
  var route = req.path;
  console.log('cookies',req.cookies,req.session.cookie.maxAge,req.sessionID)
  if (!req.session.user) {

    if (req.headers["x-requested-with"] != null && req.headers["x-requested-with"] == "XMLHttpRequest" && req.url != "/login") {
      return res.json({
        ret_code: 99,
        ret_msg: '登录信息失效，请您重新登录'
      });
    }
    
    if (req.path == "/login"||white_path.indexOf(route)>=0) {
       next();
    }else{
       res.redirect('/login');
    }

  }else if(req.session.user){
    next();
  }
  //全局user赋值
  app.locals.user = req.session.user ?  req.session.user :'';

};

app.use(isLogin);
app.use('/',routes);
app.use('/',user);

//role 1.admin 2.normal 3.guest

//404页面
app.use(function(req,res,next){
  res.send("404");
});
//捕获异常防止服务崩溃
app.use(function (err, req, res, next) {
    res.send("错误发生：" + err.stack);
});

var server = app.listen(8088,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为 http://%s:%s',host,port)
});

module.exports = app;