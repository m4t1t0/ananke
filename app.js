'use strict';

const koa = require('koa');
const router = require('koa-route');
const Pug = require('koa-pug');
const serve = require('koa-static');
const Sequelize = require('sequelize');
const Task = require('./models/task.js');

const app = module.exports = koa();

const pug = new Pug({
    viewPath: './views',
    debug: true,
    compileDebug: false,
    app: app
});

const sequelize = new Sequelize('sqlite://ananke.db');
let task = new Task(sequelize);

app.use(serve('statics'));

app.use(router.get('/', function *() {
    let params = {
        items: yield task.findAll()
    };
    this.render('home.pug', params);
}));

const port = process.env.PORT || 8124;
app.listen(port);
