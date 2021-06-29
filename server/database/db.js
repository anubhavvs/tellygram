const { sequelize } = require('../models');

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to Postgres Database!');
    } catch(error) {
        console.log(error);
    }
}

module.exports = connectDB;