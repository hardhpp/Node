var http = require('http')
var querystring = require('querystring')   // querystring模块需要使用npm安装

var postData = querystring.stringify({
    'msg': 'Hello World!'
});

var options = {
    hostname: 'www.baidu.com',
    port: null,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};

var req = http.request(options, function (res) {
    var html = ''
    console.log('状态码:' + res.statusCode);
    console.log('头部信息:' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        html += chunk;
    })
    res.on('end', function () {
        console.log(html);
     });
}).on('error', function (e) {
    console.error('请求出错了！');
});

// write data to request body
req.write(postData);
req.end();