'use strict';

const Sequelize = require('sequelize');
const Base = require('./base.js');

class Task extends Base {
    constructor(db) {
        super(db);
        this.model = db.define('task', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            schedule_id: {
                type: Sequelize.INTEGER
            },
            command: {
                type: Sequelize.STRING
            }
        }, {
            freezeTableName: true,
            timestamps: true
        });
    }

    findAllWithPattern() {
        let sql = "SELECT t.id, t.name, t.description, s.pattern, t.command" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }

    findAllWithExecution() {
        let sql = "SELECT t.id, t.name, t.description, t.command, s.name AS schedule_name, s.pattern, e.status" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id" +
            " LEFT JOIN execution e ON e.task_id = t.id";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }
}

module.exports = Task;