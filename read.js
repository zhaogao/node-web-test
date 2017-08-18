var fs = require('fs');
var events = require('events');
var zlib = require('zlib');
var url = require('url');
// var querystring = require('')

var hello = require('./hello');

process.on('exit',function(code){
	console.log('退出码',code)
})
console.log('文件执行结束')

process.on('uncaughtException',function(err){
	console.log(err.stack)
})

// hello.world();
// console.log( __filename );

// fs.createReadStream('tedst.text')
// .pipe(zlib.createGzip())
// .pipe(fs.createWriteStream('test.test.gz'));
// console.log('文件压缩完成')
// var readStream = fs.createReadStream('test.tedt.gz');

// readStream.pipe(zlib.createGunzip())
// .pipe(fs.createWriteStream('input.text'));

// readStream.on('error',function(err){
// 	console.log(err.stack)
// })

// console.log('文件解压完成')

// var readStream = fs.createReadStream('test.text');
// var data = '';
// readStream.setEncoding('utf8');
// readStream.on('data',function(chunk){
// 	data +=chunk
// 	// console.log(chunk)
// });
// readStream.on('end',function(){
// 	console.log(data)
// })
// readStream.on('error',function(err){
// 	console.log(err.stack)
// })

// var data = '我是最后通过nodejs添加进来的sdfsff';

// var writeStream = fs.createWriteStream('test.text');
// writeStream.write(data,'utf8');

// writeStream.end();

// writeStream.on('finsh',function(){
// 	console.log('写入完成')
// })

// writeStream.on('error',function(err){
// 	console.lgo(err.stack)
// })

// fs.mkdir('test1')

// fs.appendFile('test.text',data,'utf8',function(err){
// 	if(err)console.log(err)
// })

// console.log('程序执行完毕')

// var buffer = require('buffer');
// debugger
// var bur = new Buffer(256);
// bur[0]=97;
// // var len = bur.write('gaozhao');
// console.log(bur.toString('utf8',0,3))

// var eventEmitter = new events.EventEmitter();

// eventEmitter.on('test',function(arg){
// 	console.log('测试成功'+arg);
// 	eventEmitter.emit('cb');
// });

// eventEmitter.on('cb',function(){
// 	console.log('获得测试结果')
// });

// eventEmitter.emit('test','高照');

// console.log('监听器个数',events.EventEmitter.listenerCount(eventEmitter,'test'))
// console.log('测试完毕')

// var data = fs.readFileSync('test.text');

// var data = fs.readFile('tedst.text',function(error,data){
// 	if(error){
// 		console.log(error)
// 		return;
// 	}
// 	console.log(data.toString());
// })

// console.log('异步')

