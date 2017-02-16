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
let taskModel = new Task(sequelize);

app.use(serve('statics'));

app.use(router.get('/', function *() {
    this.render('home.pug');
}));

app.use(router.get('/tasks', function *() {
    let result = [];
    let tasks = yield taskModel.findAll();

    for (let task of tasks) {
        result.push({
            name: task.name,
            description: task.description
        });
    }

    this.body = result;
}));

const port = process.env.PORT || 8124;
app.listen(port);
