'use strict';

const koa = require('koa');
const app = module.exports = koa();
const sqlite3 = require('co-sqlite3');
const router = require('koa-route');
const Pug = require('koa-pug');
const crontabModel = require('./model/crontab');

const pug = new Pug({
    viewPath: './views',
    debug: true,
    compileDebug: false,
    app: app
});

app.use(function *(next){
    this.db = yield sqlite3('ananke.db');
    yield next
});

app.use(router.get('/', function *() {
    crontabModel.setup();
    this.render('home.pug', {title: 'Ananke, the revolutionary crontab editor'});
}));

const port = process.env.PORT || 8124;
app.listen(port);
