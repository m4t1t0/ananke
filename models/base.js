'use strict';

const Sequelize = require('sequelize');

class Base {
    constructor(db) {
        this.db = db;
    }

    build(params) {
        this.instance = this.model.build(params);
    }

    save() {
        return this.instance.save().then(function() {
            return true;
        });
    }
}

module.exports = Base;