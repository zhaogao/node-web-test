var http = require('http');

var options ={
	host:'localhost',
	port:8888,
	path:'/index.html'
};

var req = http.request(options,function(res){
	var body = '';
	res.on('data',function(data){
		body += data;
	});

	res.on('end',function(){
		console.log(body)
	})
});
req.end();