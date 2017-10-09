var express = require('express');
var router = express.Router();
// var mysql  = require('mysql'); 
var multer = require('multer');
var app = express();
var path = require('path');
var moment = require('moment');

router.get('/', function(req, res) {

	var user_list = pool.query('select * from user order by id desc');
	var article_list = pool.query('select * from article order by aid desc');

	Promise.all([user_list,article_list]).then((result)=>{

		res.render('index',{
			title:'主页',
			newList:result[0],
			articleList:result[1]
		});
	}).catch((err)=>{
		console.log('主页err',err.message);
	});

});

router.get('/user', function(req, res) {
	console.log('用户名', req.session.user)
	pool.getConnection(function(err, connection) {
		connection.query('select * from user order by id desc', function(err, result) {
			connection.release();
			if (err) {
				console.log('err', err.message)
			} else {
				console.log(result)
				res.render('user', {
					title: '用户列表',
					list: result,
					layout: 'layout'
				});
			}
		});
	})
});

//博客相关
router.route('/publish').get(function(req, res) {

	pool.query("select * from articleCate").then(function(rows) {
		res.render('publish', {
			title: '写博客',
			category: rows,
			layout: 'layout'
		})
	}).catch(function(err) {
		console.log(err)
		res.sendStatus(500);
	});

}).post(function(req, res) {

	var params = req.body;
	var create_time = moment().format('YYYY-MM-DD HH:mm:ss');
	var sql = 'insert into article(acate,author,title,content,isTop,click,addTime)values(?,?,?,?,?,?,?)';

	if(req.query.type=='add'){ //新的才添加
		pool.query(sql, [params.category, req.session.user.name, params.head, params.article, 0, 0, create_time]).then(function(rows) {
			console.log('end',rows)
			if(rows&&rows.affectedRows>0){
				res.json({
					code:0,
					ret_msg:'发布成功'
				})
			}
		}).catch(function(err){
			res.sendStatus(500)
		})
	} else if(req.query.type=='edite'){//编辑博客
		console.log()
	}
});

//创建博客分类
// router.post

//选择diskStorage存储
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.resolve('public/photo'));
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); //增加了文件的扩展名
	}
});

var upload = multer({
	storage: storage
});

var type_array = ['jpeg', 'jpg', 'png', 'gif'];

router.post('/file_upload', upload.array('head'), function(req, res) {
	console.log(req.files);
	var oImage = req.files[0];
	var file_type = oImage.mimetype.split('/')[1];
	if (type_array.indexOf(file_type) < 0) {
		res.json({
			code: 1,
			ret_msg: '请上传正确格式图片'
		})
	} else {
		// console.log('res',db.mysql_create('select * from user'));
		res.json({
			code: 0,
			ret_msg: {
				headsrc: 'photo/' + oImage.filename
			}
		});
	}

});

module.exports = router;