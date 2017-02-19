'use strict';

const koa = require('koa');
const router = require('koa-router')();
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

router.get('/', function *() {
    this.render('home.pug');
});

router.get('/ajax/tasks', function *() {
    let result = [];
    let tasks = yield taskModel.findAll();

    for (let task of tasks) {
        result.push({
            id: task.id,
            name: task.name,
            description: task.description
        });
    }

    this.body = {http_code: 200, data: result};
});

router.del('/ajax/task/:id', function *() {
    let myTask = yield taskModel.findById(this.params.id);
    yield myTask.destroy();
    this.body = {http_code: 200, data: []};
});

app
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 8124;
app.listen(port);
