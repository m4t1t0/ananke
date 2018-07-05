'use strict';

const Sequelize = require('sequelize');
const Base = require('./base.js');

class Execution extends Base {
    constructor(db) {
        super(db);
        this.model = db.define('execution', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            task_id: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER
            },
            output: {
                type: Sequelize.STRING
            }
        }, {
            freezeTableName: true,
            timestamps: true
        });
    }

    deleteLast(taskId) {
        let sql = "DELETE FROM execution WHERE createdAt <= '2010-01-01 00:00:00'";
        return this.db.query(sql, {
            replacements: {task_id: taskId},
            type: this.db.QueryTypes.DELETE
        });
    }

    findByTaskId(taskId) {
        let sql = "SELECT e.id, e.status, e.output, e.createdAt" +
            " FROM execution e" +
            " WHERE e.task_id = :task_id";
        return this.db.query(sql, {
                replacements: {task_id: taskId},
                type: this.db.QueryTypes.SELECT
            }
        );
    }
}

module.exports = Execution;