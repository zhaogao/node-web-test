var express = require('express');
var router = express.Router();


router.route('/login').get(function(req,res){
	res.render('login',{title:'登录',layout:'layout'});
}).post(function(req,res){
	pool.getConnection(function(err,connection){
		connection.query('SELECT name,pwd FROM USER WHERE NAME='+connection.escape(req.body.name),function(err,result){
			if(err){
				console.log(err)
				res.send(500);
			}else if(!result){
				res.json({
					code:1,
					ret_msg:'用户不存在'
				});
			}else{
				console.log('ss',result)
				if(req.body.pwd != result[0].pwd){
					res.json({
						code:1,
						ret_msg:'密码错误'
					});
				}else{
					req.session.user = result;
					// res.send(200);
					res.json({
						code:0,
						ret_msg:'成功'
					});
				}
			}
		})
	});
	// res.json(req.body.name)
});

router.get('/user/:name/edite',function(req,res){
	res.send('edite:'+req.params.name);
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

	var sql = 'insert into user (name,pwd,age,head) values (?,?,?,?)';
	// var result = db.mysql_create(sql);
	pool.getConnection(function(err,connection){
		connection.query(sql,[response.name,response.pwd,response.age,response.head],function(err,result){
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
	})

});


router.get('/loginout',function(req,res){
	req.session.user = null;
	res.redirect("/");
});

module.exports = router;