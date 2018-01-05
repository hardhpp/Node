var http = require('http')
var cheerio = require('cheerio')
var url = 'http://xgfe.github.io/'

var urlArr = url.split('')
urlArr.splice(-1)
var rootUrl = urlArr.join('')

var index =0 

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

// 获取网页源代码
http.get(url,function(res){
    var html = '';

    res.on('data',function(data){
        html+=data;
    })

    res.on('end',function(){
        var data = filterBlogInfo(html)
        printBlogInfo(data)
    })
}).on('error',function(){
    console.log('获取数据出错');
})