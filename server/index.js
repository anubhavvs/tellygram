const { ApolloServer } = require('apollo-server');
const connectDB = require('./database/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (context) => context
});

server.listen({port: process.env.PORT}).then(({url, subscriptionsUrl}) => {
    console.log(`Server running on ${url}`);
    console.log(`Subscriptions running on ${subscriptionsUrl}`);
})

console.log(process.env.PORT);