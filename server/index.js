const { ApolloServer } = require('apollo-server');
const connectDB = require('./database/db');
require('dotenv').config();

connectDB();

console.log(process.env.PORT);