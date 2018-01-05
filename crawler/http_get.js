var http = require('http')

http.get('http://www.baidu.com',function (res) {
    var html = '';

    console.log('状态码:' + res.statusCode);
    res.on('data', function (data) {
        html += data
    })
    res.on('end', function (){
        console.log(html)
    })
}).on('error', function () {
    console.log('获取数据出错')
})