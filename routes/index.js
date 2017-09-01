var express = require('express');
var router = express.Router();
var mysql  = require('mysql'); 
var multer  = require('multer');
var app = express();
var path = require('path');

router.get('/',function(req,res){
	pool.getConnection(function(err,connection){
		connection.query('select * from user order by id desc',function(err,result){

			connection.release();
			if(err){
				console.log('err',err.message)
			}else{
				console.log(result)
				res.render('index', {
					title: '主页',
					user: req.session.user,
					newList: result
				})
			}

			
		});
	})
	
});

router.get('/user',function(req,res){
	console.log('用户名',req.session.user)
	pool.getConnection(function(err,connection){
		connection.query('select * from user order by id desc',function(err,result){
			connection.release();
			if(err){
				console.log('err',err.message)
			}else{
				console.log(result)
				res.render('user',{title:'用户列表',list:result,layout:'layout'});
			}
		});
	})
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

var type_array = ['jpeg','jpg','png','gif'];

router.post('/file_upload',upload.array('head'),function(req,res){
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

});

module.exports = router;

