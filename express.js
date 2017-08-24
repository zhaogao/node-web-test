var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressLayout = require('express-ejs-layouts');
// var fs = require('fs');
var mysql  = require('mysql'); 
var db = require('./db');

var app = express();
var routes = require('./routes/index');
var user = require('./routes/user');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
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

app.use(function(req,res,next){
	console.log('ssss');
	next();
})

app.use('/',routes);
app.use('/',user);



// app.use(function(req,res,next){
// 	console.log('sss',!req.session.user)
// 	if(!req.session.user){
// 		res.redirect("/login");
// 	}
// 	next();
// });

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
})