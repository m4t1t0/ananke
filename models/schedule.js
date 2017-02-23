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
}

module.exports = Schedule;