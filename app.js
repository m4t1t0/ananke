'use strict';

const koa = require('koa');
const router = require('koa-route');
const Pug = require('koa-pug');
const Sequelize = require('sequelize');
const Crontab = require('./models/crontab.js');

const app = module.exports = koa();

const pug = new Pug({
    viewPath: './views',
    debug: true,
    compileDebug: false,
    app: app
});

const sequelize = new Sequelize('sqlite://ananke.db');
let crontab = new Crontab(sequelize);

app.use(router.get('/', function *() {
    let params = {
        items: yield crontab.findAll()
    };
    this.render('home.pug', params);
}));

const port = process.env.PORT || 8124;
app.listen(port);
