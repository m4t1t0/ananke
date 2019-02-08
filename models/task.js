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
            },
            active: {
                type: Sequelize.BOOLEAN
            }
        }, {
            freezeTableName: true,
            timestamps: true
        });
    }

    findActiveWithPattern() {
        let sql = "SELECT t.id, t.name, t.description, s.pattern, t.command, t.active" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id" +
            " WHERE t.active = 1";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }

    findAllWithExecution() {
        let sql = "SELECT t.id, t.name, t.description, t.command, t.active, s.name AS schedule_name, s.pattern, q.status" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id" +
            " LEFT JOIN (SELECT MAX(id) AS mid, task_id, status FROM execution GROUP BY task_id) q ON  q.task_id = t.id";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }

    getNumberFailedTasks() {
        let sql = "SELECT COUNT(t.id) AS num_failed" +
            " FROM task t" +
            " INNER JOIN (SELECT MAX(id) AS max_execution, task_id, status FROM execution GROUP BY task_id) q on q.task_id = t.id" +
            " WHERE q.status = 1" +
            " AND q.active = 1";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }

    findAllFailedWithExecution() {
        let sql = "SELECT t.id, t.name, t.description, t.command, t.active, s.name AS schedule_name, s.pattern, q.status" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id" +
            " LEFT JOIN (SELECT MAX(id) AS mid, task_id, status FROM execution GROUP BY task_id) q ON  q.task_id = t.id" +
            " WHERE t.active = 1" +
            " AND t.id IN (" +
            "    SELECT t.id" +
            "    FROM task t" +
            "    INNER JOIN (SELECT MAX(id) AS max_execution, task_id, status FROM execution GROUP BY task_id) q on q.task_id = t.id" +
            "    WHERE q.status = 1" +
            " )";
        return this.db.query(sql, {type: this.db.QueryTypes.SELECT});
    }
}

module.exports = Task;