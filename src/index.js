import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Components/Home';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { Provider } from './Container';
import LoginPage from './Components/LoginPage';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
import 'mdb-ui-kit/css/mdb.min.css';
import ExecutorsPage from './Components/ExecutorsPage';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

//const root = ReactDOM.createRoot(document.getElementById('root'));
const rootNode = document.getElementById('root');
ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/scheduler" element={<App/>}>
            <Route path="" element={<Home/>}/>
            <Route path="executors" element={<ExecutorsPage/>}/>
          </Route>
          <Route path='/login' element={<LoginPage/>} />
          <Route path="*" element={<Navigate replace to="/scheduler" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
    rootNode
);

