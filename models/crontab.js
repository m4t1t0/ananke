'use strict';

const Sequelize = require('sequelize');

class Crontab {
    constructor(db) {
        this.db = db;
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