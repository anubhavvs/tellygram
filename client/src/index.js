import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { AuthProvider } from './context/auth';
import './index.css';
import App from './App';

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
