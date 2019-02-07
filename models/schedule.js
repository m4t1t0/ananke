'use strict';

const Sequelize = require('sequelize');
const Base = require('./base.js');

class Schedule extends Base {
    constructor(db) {
        super(db);
        this.model = db.define('schedule', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING
            },
            pattern: {
                type: Sequelize.STRING
            }
        }, {
            freezeTableName: true,
            timestamps: true
        });
    }

    findTasksByScheduleId(idTask) {
        let sql = "SELECT t.id, t.name, t.description" +
            " FROM task t" +
            " INNER JOIN schedule s ON t.schedule_id = s.id" +
            " WHERE s.id = $id";
        return this.db.query(sql, {bind: {id: idTask}, type: this.db.QueryTypes.SELECT});
    }
}

module.exports = Schedule;