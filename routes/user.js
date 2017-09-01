var express = require('express');
var router = express.Router();
var moment = require('moment');


router.route('/login').get(function(req,res){
	res.render('login',{title:'登录',layout:'layout'});
}).post(function(req,res){
	pool.getConnection(function(err,connection){
		connection.query('SELECT name,pwd FROM USER WHERE NAME='+connection.escape(req.body.name),function(err,result){
			console.log('&&&&&&',err,result.length)
			if(err){
				console.log(err)
				res.send(500);
			}else if(result&&result.length==0){
				res.json({
					code:1,
					ret_msg:'用户不存在'
				});
			}else{
				
				if(req.body.pwd != result[0].pwd){
					res.json({
						code:1,
						ret_msg:'密码错误'
					});
				}else{
					req.session.user = result[0].name;

					// res.location('/user');

					res.json({
						code:0,
						ret_msg:'登录成功'
					})

				}
			}
		})
	});
});


router.get('/download',function(req,res){
	res.download('public/download/1234.xls');
});

router.route('/reg').get(function(req,res){
	res.render('reg',{
		title:'注册',
		layout:'layout'
	});
}).post(function(req,res){
	var response = {
		'name':req.body.name,
		'pwd':req.body.pwd,
		'age':req.body.age,
		'head':req.body.head
	};

	var sql = 'insert into user (name,pwd,age,head,role,create_time) values (?,?,?,?,?,?)';
	// var result = db.mysql_create(sql);
	pool.getConnection(function(err,connection){

		//创建之前先确认没有改用户名
		connection.query('select * from user where name="'+response.name+'"',function(err,result){
			if(err){
				res.json({
					code:1,
					ret_msg:err.message
				});
			}else{

				if(result.length>0){
					res.json({
						code:1,
						ret_msg:'该用户名已存在'
					})
				}else{
					var create_time = moment().format('YYYY-MM-DD HH:mm:ss');

					connection.query(sql,[response.name,response.pwd,response.age,response.head,'normal',create_time],function(err,result){
						connection.release();
						if(err){
							res.json({
								code:1,
								ret_msg:err.message
							});
						}else{
							req.session.user=req.body.name;
							res.json({
								code:0,
								ret_msg:'添加成功'
							})
						}
					});
				}
			}

		});

	})

});


router.get('/loginout',function(req,res){
	req.session.user = null;
	res.redirect("/");
});

module.exports = router;