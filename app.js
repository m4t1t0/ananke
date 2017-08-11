'use strict';

const koa = require('koa');
const router = require('koa-router')();
const koaBody   = require('koa-body')();
const Pug = require('koa-pug');
const serve = require('koa-static');
const Sequelize = require('sequelize');
const Task = require('./models/task.js');
const Schedule = require('./models/schedule.js');

const app = module.exports = koa();

const pug = new Pug({
    viewPath: './views',
    debug: true,
    compileDebug: false,
    app: app
});

const sequelize = new Sequelize('sqlite://ananke.db');
let taskModel = new Task(sequelize);
let scheduleModel = new Schedule(sequelize);

app.use(serve('statics'));

//------------------------------------------
// HTML routes
//------------------------------------------
router.get('/', function *() {
    this.render('home.pug');
});

router.get('/task/add', function *() {
    this.render('edit_task.pug', {task: {}});
});

router.get('/schedules', function *() {
    this.render('schedules.pug');
});

router.get('/schedule/add', function *() {
    this.render('edit_schedule.pug', {schedule: {}});
});

router.get('/ajax/task/:id', function *(next) {
    let myTask = yield taskModel.findById(this.params.id);

    if (myTask !== null) {
        this.render('edit_task.pug', {task: myTask});
    } else {
        this.status = 404;
        this.body = {http_code: 404, error_msg: 'Task not found!'};
    }
});

router.get('/ajax/schedule/:id', function *(next) {
    let mySchedule = yield scheduleModel.findById(this.params.id);

    if (mySchedule !== null) {
        this.render('edit_schedule.pug', {schedule: mySchedule});
    } else {
        this.status = 404;
        this.body = {http_code: 404, error_msg: 'Schedule not found!'};
    }
});

//------------------------------------------
// Ajax routes
//------------------------------------------
router.get('/ajax/tasks', function *(next) {
    let result = [];
    let tasks = yield taskModel.findAllWithExecution();

    for (let task of tasks) {
        result.push({
            id: task.id,
            name: task.name,
            schedule_name: task.schedule_name,
            status: task.status
        });
    }

    this.body = {http_code: 200, data: result};
});

router.get('/ajax/schedules', function *(next) {
    let result = [];
    let schedules = yield scheduleModel.findAll();

    for (let schedule of schedules) {
        result.push({
            id: schedule.id,
            name: schedule.name,
            pattern: schedule.pattern
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

    if (req.name && req.desc && req.schedule_id && req.command) {
        let params = {
            name: req.name,
            description: req.desc,
            schedule_id: req.schedule_id,
            command: req.command
        };
        yield taskModel.create(params, {});
        this.body = {http_code: 200, data: [{id: yield taskModel.getLastInsertRowid()}]};
    } else {
        this.status = 500;
        this.body = {http_code: 500, error_msg: 'Not enought data!'};
    }
});

router.post('/ajax/schedule', koaBody, function *(next) {
    let req = this.request.body;

    if (req.name && req.pattern) {
        yield scheduleModel.create({name: req.name, pattern: req.pattern}, {});
        this.body = {http_code: 200, data: [{id: yield scheduleModel.getLastInsertRowid()}]};
    } else {
        this.status = 500;
        this.body = {http_code: 500, error_msg: 'Not enought data!'};
    }
});

router.del('/ajax/schedule/:id', function *(next) {
    let mySchedule = yield scheduleModel.findById(this.params.id);

    if (mySchedule !== null) {
        yield mySchedule.destroy();
        this.body = {http_code: 200, data: []};
    } else {
        this.status = 404;
        this.body = {http_code: 404, error_msg: 'Schedule not found!'};
    }
});
//------------------------------------------

app
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 8124;
app.listen(port);
