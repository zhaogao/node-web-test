var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var path = require('path');
var multer  = require('multer');
// var formidable = require('formidable');
var fs = require('fs');

var app = express();

//所有请求过来，都去项目当前的public目录下寻找所请求的文件，找到就返回
app.use(express.static('public'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })


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
	res.send('hello world')
});

var count = 1;

app.get('/user',function(req,res){
	count++;
	res.cookie('hello',count)
	// res.send('hello user')
	res.sendFile(__dirname+'/'+'index.html');
});

app.get('/upload',function(req,res){

	res.sendFile(__dirname+'/'+'upload.html');
});

app.post('/get_info',urlencodedParser,function(req,res){
	var response = {
		'name':req.body.name,
		'age':req.body.age
	};
	// req.set({'Content-Type':'application/json;charset=utf8;'});
	res.set({'Content-Type':'application/json;charset=utf8;'})
	// res.contentType('json');
	// console.log(req.body.name)
	// res.send(JSON.stringify(response));
	// res.type('application/json');
	res.end(JSON.stringify(response));
	// res.json(response)
});

app.post('/file_upload',upload.array('head'),function(req,res){
	console.log(req.files);
	res.json({
		headsrc:'photo/'+req.files[0].filename
	});
})

var server = app.listen(8088,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为 http://%s:%s',host,port)
})