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

    destroy() {
        return this.instance.destroy().then(function() {
            return true;
        });
    }

    findAll() {
        return this.model.findAll().then(function(result) {
            return result;
        });
    }

    findById(id) {
        return this.model.findById(id).then(function(result) {
            return result;
        });
    }
}

module.exports = Base;