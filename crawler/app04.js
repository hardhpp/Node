var http = require('http')
var cheerio = require('cheerio')
var url = 'http://xgfe.github.io/'

var urlArr = url.split('')
urlArr.splice(-1)
var rootUrl = urlArr.join('')

var index = 0

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

// 获取内容
function filterBlogInfo(html) {

    var $ = cheerio.load(html)
    var blogContent = $('#content .post')
    var blogInfo =  []
    var root

    blogContent.each(function (index,item) {
        var blogItemHeader = $(this).find('.post-header')
        var blogItemBody = $(this).find('.post-body')
        var blogArticleInfo = {}
        var blogTitle = blogItemHeader.find('.post-title-link').text().trim()
        var blogHref = rootUrl + blogItemHeader.find('.post-title-link').attr('href')
        var blogTime = blogItemHeader.find('.post-time time').text().trim()
        var blogAuthor = blogItemHeader.find('.post-category a').text().trim()
        var blogKeywords = []
        blogItemHeader.find('.post-tags a').each(function (tagItem) {
            blogKeywords.push($(this).text().trim())
        })
        var blogAbstract = blogItemBody.find('p').text().trim()

        blogArticleInfo.blogTitle = blogTitle
        blogArticleInfo.blogHref = blogHref
        blogArticleInfo.blogTime = blogTime
        blogArticleInfo.blogAuthor = blogAuthor
        blogArticleInfo.blogKeywords = blogKeywords
        blogArticleInfo.blogAbstract = blogAbstract

        blogInfo.push(blogArticleInfo)
    })

    return blogInfo
}

// 打印数据
function printBlogInfo (blogInfo) {

    blogInfo.forEach(function (item) {
        console.log(index++)
        console.log('题目： ' + item.blogTitle)
        console.log('链接： ' + item.blogHref)
        console.log('时间： ' + item.blogTime)
        console.log('作者： ' + item.blogAuthor)
        console.log('关键字： ')
        item.blogKeywords.forEach( function (tagItem) {
            console.log(tagItem)
        })
        console.log("简介： " + item.blogAbstract +'\n')
    })
}

function getUrlAsync(url) {
    return new Promise(function (resolve, reject){
        console.log('正在爬取： ' + url)
        http.get(url, function(res){
            var html = ''
            res.on('data',function (data) {
                html += data
            })

            res.on('end',function (){
                resolve(html)
            })
        }).on('error', function () {
            reject(e)
            console.log('获取' + url + '页面数据出错!')
        })
    })
}

// 获取页面源代码
http.get(url,function(res){
    var html = '';

    res.on('data',function(data){
        html+=data;
    })

    res.on('end',function(){
        var URLs = fetchPageUrl(html)
        
        var fetchPageDataArray = []

        URLs.forEach(function (url) {
            fetchPageDataArray.push(getUrlAsync(url))
        })

        // 执行promise 
        Promise
            .all(fetchPageDataArray)
            .then(function (pages) {
                pages.forEach( function (pageItem){
                    printBlogInfo(filterBlogInfo(pageItem))
                })
            })
    })
}).on('error',function(){
    console.log('获取数据出错');
})