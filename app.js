'use strict';

const koa = require('koa');
const router = require('koa-router')();
const koaBody   = require('koa-body')();
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

//------------------------------------------
// HTML routes
//------------------------------------------
router.get('/', function *() {
    this.render('home.pug');
});

router.get('/task/add', function *() {
    this.render('edit.pug');
});

//------------------------------------------
// Ajax routes
//------------------------------------------
router.get('/ajax/tasks', function *(next) {
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

router.del('/ajax/task/:id', function *(next) {
    let myTask = yield taskModel.findById(this.params.id);

    if (myTask !== null) {
        yield myTask.destroy();
        this.body = {http_code: 200, data: []};
    } else {
        this.status = 404;
        this.body = {http_code: 404, error_msg: 'Task not found!'};
    }
});

router.post('/ajax/task', koaBody, function *(next) {
    let req = this.request.body;
    if (req.name && req.desc) {
        yield taskModel.create({name: req.name, description: req.desc}, {});
        this.body = {http_code: 200, data: [{id: yield taskModel.getLastInsertRowid()}]};
    } else {
        this.status = 500;
        this.body = {http_code: 500, error_msg: 'Not enought data!'};
    }
});
//------------------------------------------

app
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 8124;
app.listen(port);
