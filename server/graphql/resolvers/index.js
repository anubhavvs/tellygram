const groupResolvers = require('./group')

moduel.exports = {
    Query: {
        ...groupResolvers.Query
    },
    Mutation: {
        ...groupResolvers.Query
    },
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Group: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    }
}