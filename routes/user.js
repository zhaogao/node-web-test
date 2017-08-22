var express = require('express');
var router = express.Router();


router.get('/login',function(req,res){
	res.render('login');
});

router.route('/reg').get(function(req,res){
	res.render('reg');
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