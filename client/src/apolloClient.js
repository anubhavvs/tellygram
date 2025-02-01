import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import storage from './utils/localStorage';

const http =
  process.env.REACT_APP_NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_REST_URL
    : 'http://localhost:4000';
const ws =
  process.env.REACT_APP_NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_WS_URL
    : 'ws://localhost:4000/graphql';

const authLink = setContext((_, { headers }) => {
  const loggedUser = storage.loadUser();

  return {
    headers: {
      ...headers,
      authorization: loggedUser ? loggedUser.token : null,
    },
  };
});

const httpLink = new HttpLink({
  uri: http,
});

const wsLink = new WebSocketLink({
  uri: ws,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => {
      return {
        Authorization: storage.loadUser()?.token,
      };
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const defination = getMainDefinition(query);
    return (
      defination.kind === 'OperationDefinition' &&
      defination.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getGroups: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  link: splitLink,
});

export default client;
