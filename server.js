var http = require('http');
var url = require('url');
var  fs = require('fs');
var querystring = require('querystring');

http.createServer(function(req,res){
	var pathname = url.parse(req.url).pathname;
	var body = '';
	console.log('Request form'+pathname+'Recived');
	fs.readFile(pathname.substr(1),function(err,data){
		if(err){
			console.log(err);
			res.writeHead(404,{'Content-Type':'text/html'})
		}else{
			res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
			res.write(data.toString())
			// req.on('data',function(chunk){
			// 	body += chunk;
			// });
			// req.on('end',function(){
			// 	body = querystring.parse(body);
			// 	res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
			// 	res.write('名称'+body.name);
			// 	res.write('年龄'+body.age);
			// 	// res.end();
			// })
		}
		res.end();
	});

}).listen(8888);
console.log('Server is running 127.0.0.1:8888')