'use strict';

const koa = require('koa');
const router = require('koa-route');
const Pug = require('koa-pug');
const Crontab = require('./models/crontab.js');

const app = module.exports = koa();

const pug = new Pug({
    viewPath: './views',
    debug: true,
    compileDebug: false,
    app: app
});



app.use(router.get('/', function *() {
    let items = yield getData();

    let params = {
        items: items
    };
    this.render('home.pug', params);
}));

const port = process.env.PORT || 8124;
app.listen(port);
