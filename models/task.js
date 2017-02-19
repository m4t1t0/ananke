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
            }
        }, {
            freezeTableName: true,
            timestamps: true
        });
    }
}

module.exports = Task;