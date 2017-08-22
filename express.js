var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var multer  = require('multer');
var mysql  = require('mysql'); 
// var formidable = require('formidable');
var fs = require('fs');

var db = require('./db');

var app = express();

//所有请求过来，都去项目当前的public目录下寻找所请求的文件，找到就返回
app.use(express.static('public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs');

var pool = mysql.createPool({     
  host     : 'localhost',       
  user     : 'root',              
  password : '',       
  port: '3306',                   
  database: 'test', 
}); 


//选择diskStorage存储
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, path.resolve('public/photo'));
 },
 filename: function (req, file, cb) {
  cb(null, Date.now() + path.extname(file.originalname));//增加了文件的扩展名
 }
});

var upload = multer({storage:storage});
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// app.use("*", function(request, response, next) {
//     response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
//     next();
// });

app.get('/',function(req,res){
	// res.send('hello world')
	res.render('index',{isLogin:false})
});

app.get('/user',function(req,res){

	pool.getConnection(function(err,connection){
		connection.query('select * from user order by id desc',function(err,result){
			connection.release();
			if(err){
				console.log('err',err.message)
			}else{
				console.log(result)
				res.render('user',{list:result});
			}
		});
	})
	
});

app.get('/reg',function(req,res){

	res.render('reg');
});

app.get('/login',function(req,res){

	res.render('login');
});

app.post('/get_info',urlencodedParser,function(req,res){
	var response = {
		'name':req.body.name,
		'pwd':req.body.pwd,
		'age':req.body.age,
		'head':req.body.head
	};
	// req.set({'Content-Type':'application/json;charset=utf8;'});
	// res.set({'Content-Type':'application/json;charset=utf8;'})
	// res.contentType('json');
	// console.log(req.body.name)
	// res.send(JSON.stringify(response));
	// res.type('application/json');

	var sql = 'insert into user (name,pwd,age,head) values (?,?,?,?)';
	// var result = db.mysql_create(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,[response.name,response.pwd,response.age,response.head],function(err,result){
			connection.release();
			if(err){
				// console.log('select error',err.message);
				res.json({
					code:1,
					ret_msg:err.message
				});
			}else{
				res.json({
					code:0,
					ret_msg:'添加成功'
				})
			}
		});
	})

});

var type_array = ['jpeg','jpg','png','gif'];

app.post('/file_upload',upload.array('head'),function(req,res){
	console.log(req.files);
	var oImage = req.files[0];
	var file_type = oImage.mimetype.split('/')[1];
	if(type_array.indexOf(file_type)<0){
		res.json({
			code:1,
			ret_msg:'请上传正确格式图片'
		})
	}else{
		// console.log('res',db.mysql_create('select * from user'));
		res.json({
			code:0,
			ret_msg:{
				headsrc:'photo/'+oImage.filename
			}
		});
	}

})

var server = app.listen(8088,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为 http://%s:%s',host,port)
})