'use strict';

const Sequelize = require('sequelize');
const Task = require('./models/task.js');
const moment = require('moment');
const cronParser = require('cron-parser');
const { exec } = require('child_process');

let cronParserOptions = {
    tz: 'Europe/Madrid'
};

const sequelize = new Sequelize('sqlite://ananke.db');
let taskModel = new Task(sequelize);

let now = moment();
let nowPlusOneMinute = moment().add(1, 'minutes');

//TODO: Hacer esto con async/await
taskModel.findAllWithPattern().then(function(tasks) {
    for (let task of tasks) {
        let pattern = task.pattern;
        let interval = cronParser.parseExpression(pattern, cronParserOptions);
        let taskMoment = moment(interval.next().toDate());

        if (taskMoment.isBetween(now, nowPlusOneMinute)) {
            let command = task.command;
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    return;
                }
            });
        }
    }
});