'use strict';

const Sequelize = require('sequelize');

class Crontab {
    constructor() {
        this.sequelize = new Sequelize('sqlite://ananke.db');
    }

    getData() {
        return sequelize.query("SELECT * FROM crontab", {type: sequelize.QueryTypes.SELECT})
            .then(function (users) {
                return users;
            });
    }
}