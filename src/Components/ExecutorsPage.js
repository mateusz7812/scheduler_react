import {Navbar, Container, Nav} from 'react-bootstrap';
import { gql, useSubscription, useQuery } from '@apollo/client';
import { useTracked } from "../Container";
import { useState } from 'react';

const EXECUTORS_FOR_ACCOUNT_QUERY = gql`
    query GetExecutorsForAccount($accountId: Int!){
        executorsForAccount(accountId: $accountId){
            id,
            name,
            description,
            status{
                statusCode,
                date
            }
        }
}
`

const EXECUTORS_STATUS_CHANGE_SUBSCRIPTION = gql`
    subscription OnExecutorStatusChange($topicName: String){
        onExecutorStatusChange(topicName: $topicName){
            id,
            executorId,
            statusCode,
            date
        }
    }
`

const ExecutorsPage = () => {
    const [executors, setExecutors] = useState([]);
    const [state, setState] = useTracked();

    useQuery(EXECUTORS_FOR_ACCOUNT_QUERY, {
        variables: {
            accountId: state.accountId
        },
        onCompleted: data => setExecutors(data?.executorsForAccount)
    });

    useSubscription(
        EXECUTORS_STATUS_CHANGE_SUBSCRIPTION,
        { 
            variables: { 
                topicName: "account" + state.accountId
            },
            onSubscriptionData: data => {
                let index = executors.findIndex(e => e.id == data?.subscriptionData?.data?.onExecutorStatusChange?.executorId);
                console.log(index);
                let updatedExecutors = [...executors];
                let updatedExecutor = {...executors[index]};
                updatedExecutor.status = data?.subscriptionData?.data?.onExecutorStatusChange
                updatedExecutors[index] = updatedExecutor;
                setExecutors(updatedExecutors);
            } 
        }
      );
    return(
        <Container>
            <h1>Executors</h1>
            {executors?.map(e => <p key={e.id}>{e.id} {e.name} {e.description} {e.status?.statusCode} {new Date((e.status?.date/10000) - Math.abs(new Date(0, 0, 1).setFullYear(1))).toLocaleString()}</p>)}
        </Container>
    )
}

export default ExecutorsPage;