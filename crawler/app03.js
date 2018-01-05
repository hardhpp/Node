var http = require('http')
var cheerio = require('cheerio')
var url = 'http://xgfe.github.io/'

var urlArr = url.split('')
urlArr.splice(-1)
var rootUrl = urlArr.join('')

// 获取分页的url
function fetchPageUrl(html) {

    var $ = cheerio.load(html)
    var blogPageTotal = $('#content .pagination .page-number').eq(2)
    var blogPageHref = blogPageTotal.attr('href').split('')
    blogPageHref.splice(-2)
    var blogPageTotalNumber = parseInt(blogPageTotal.text()) 
    var pageUrl =  [url]

    for(var i=2; i <= blogPageTotalNumber; i++){
        pageUrl.push(rootUrl + blogPageHref.join('')+i+'/')
    }

    return pageUrl
}

// 打印数据
function printPageUrl(pageUrl) {

    pageUrl.forEach(function (item, index) {
        console.log(item)
    })
}

// 获取页面源代码
http.get(url,function(res){
    var html = '';

    res.on('data',function(data){
        html+=data;
    })

    res.on('end',function(){
        var data = fetchPageUrl(html)
        printPageUrl(data)
    })
}).on('error',function(){
    console.log('获取数据出错');
})