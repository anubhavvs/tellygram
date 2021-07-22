const groupResolvers = require('./group');
const userResolvers = require('./user');
const messageResolvers = require('./message');

module.exports = {
    Query: {
        ...groupResolvers.Query,
        ...userResolvers.Query,
        ...messageResolvers.Query
    },
    Mutation: {
        ...groupResolvers.Mutation,
        ...userResolvers.Mutation,
        ...messageResolvers.Mutation
    },
    Subscription: {
        ...messageResolvers.Subscription,
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Group: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    }
}