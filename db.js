var mysql  = require('mysql'); 

exports.mysql_create = function(sql){

	var connection = mysql.createConnection({     
	  host     : 'localhost',       
	  user     : 'root',              
	  password : '',       
	  port: '3306',                   
	  database: 'test', 
	}); 

	connection.connect();

	connection.query(sql,function(err,result){
		if(err){
			console.log('select error',err.message);
			return;
		}

		return result;
	});

	connection.end();

} 

// export mysql_create;

