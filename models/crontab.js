'use strict';

const Sequelize = require('sequelize');
const Base = require('./base.js');

class Crontab extends Base {
    constructor(db) {
        super(db);
        this.model = db.define('crontab', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING
            }
        }, {
            freezeTableName: true,
            timestamps: false
        });
    }

    findAll() {
        return this.model.findAll().then(function(result) {
            return result;
        });
    }
}

module.exports = Crontab;