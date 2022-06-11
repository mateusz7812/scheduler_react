import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Components/Home';
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { StateProvider } from './Container';
import LoginPage from './Components/LoginPage';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
import 'mdb-ui-kit/css/mdb.min.css';
import ExecutorsPage from './Components/ExecutorsPage';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import TasksPage from './Components/TasksPage';
import FlowsPage from './Components/FlowsPage';
import FlowPage from './Components/FlowPage';
import NewTaskPage from './Components/NewTaskPage';
import NewFlowPage from './Components/NewFlowPage';
import FlowRunsPage from './Components/FlowRunsPage';
import "bootstrap/dist/css/bootstrap.min.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import LogoutPage from "./Components/LogoutPage";
import FlowRunPage from './Components/FlowRunPage';

const server_address = process.env.REACT_APP_GRAPHQL_ADDRESS //"http://scheduler-server-2.westeurope.azurecontainer.io:3000/graphql"
console.log(`REACT_APP_GRAPHQL_ADDRESS: ${process.env.REACT_APP_GRAPHQL_ADDRESS}`);
const msalInstance = new PublicClientApplication(msalConfig);

const httpLink = new HttpLink({
  uri: server_address
});

const wsLink = new GraphQLWsLink(createClient({
  url: server_address,
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

const rootNode = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MsalProvider instance={msalInstance}>
        <StateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/scheduler" element={<App/>}>
                <Route path="" element={<Home/>}/>
                <Route path="executors" element={<ExecutorsPage/>}/>
                <Route path="tasks" element={<Outlet/>}>
                  <Route path="" element={<TasksPage/>}/>
                  <Route path="new" element={<NewTaskPage/>}/>
                </Route>
                <Route path="flows" element={<Outlet />}>
                  <Route path="" element={<FlowsPage/>}/>
                  <Route path=":flowId" element={<Outlet/>}>
                    <Route path="" element={<FlowPage/>}/>
                    <Route path="runs" element={<Outlet/>}>
                      <Route path="" element={<FlowRunsPage/>}/>
                      <Route path=":runId" element={<FlowRunPage/>}/>
                    </Route>
                  </Route>
                  <Route path="new" element={<NewFlowPage/>}/>
                </Route>
              </Route>
              <Route path='/login' element={<LoginPage/>} />
              <Route path='/logout' element={<LogoutPage/>} />
              <Route path="*" element={<Navigate replace to="/scheduler" />} />
            </Routes>
          </BrowserRouter>
        </StateProvider>
      </MsalProvider>
    </ApolloProvider>
  </React.StrictMode>,
    rootNode
);

