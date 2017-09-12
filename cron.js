'use strict';

const Sequelize = require('sequelize');
const Task = require('./models/task.js');
const Execution = require('./models/execution.js');
const moment = require('moment');
const cronParser = require('cron-parser');
const { exec } = require('child_process');

let cronParserOptions = {
    tz: 'Europe/Madrid'
};

const sequelize = new Sequelize('sqlite://ananke.db');
let taskModel = new Task(sequelize);
let executionModel = new Execution(sequelize);

let now = moment();
let nowPlusOneMinute = moment().add(1, 'minutes');

//TODO: Hacer esto con async/await o con yield. Quitar las promesas interiores

taskModel.findActiveWithPattern().then(function(tasks) {
    for (let task of tasks) {
        let pattern = task.pattern;
        let interval = cronParser.parseExpression(pattern, cronParserOptions);
        let taskMoment = moment(interval.next().toDate());

        if (taskMoment.isBetween(now, nowPlusOneMinute)) {
            let command = task.command;
            exec(command, {shell: '/bin/bash'}, (err, stdout, stderr) => {
                executionModel.deleteLast(task.id).then(() => {
                    let params = {
                        task_id: task.id
                    };

                    if (err) {
                        params.status = 1;
                        params.output = stderr;
                    } else {
                        params.status = 0;
                        params.output = stdout;
                    }

                    executionModel.create(params, {}).then(() => {});
                });
            });
        }
    }
});
