const groupResolvers = require('./group');
const userResolvers = require('./user');

module.exports = {
    Query: {
        ...groupResolvers.Query,
        ...userResolvers.Query
    },
    Mutation: {
        ...groupResolvers.Mutation,
        ...userResolvers.Mutation
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Group: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    }
}