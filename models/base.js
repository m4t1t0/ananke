'use strict';

const Sequelize = require('sequelize');

class Base {
    constructor(db) {
        this.db = db;
    }

    build(params) {
        this.instance = this.model.build(params);

        return this.instance;
    }

    create(fields, params) {
        return this.model.create(fields, params).then(result => result);
    }

    query(sql) {
        return this.db.query(sql);
    }

    getLastInsertRowid() {
        return this.query("SELECT last_insert_rowid() AS lastid").then(result => result[0][0].lastid);
    }

    findAll() {
        return this.model.findAll().then(result => result);
    }

    findById(id) {
        return this.model.findById(id).then(result => result);
    }
}

module.exports = Base;