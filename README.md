## 项目介绍

本项目仅实现通过爬虫爬取目标网站新闻，再通过分类显示新闻的功能。
项目使用node.js内置模块搭建服务器运行。前端页面使用Vue.js进行开发，后台均由node.js及其npm开发，使用mongoDB作为数据库。

## npm

客户端请求代理模块：superagent
页面分析模块：cheerio
异步处理：async
数据库操作：mongoose

## 启动

input.js用于爬取数据并存入数据库
app.js为创建服务并显示网站
