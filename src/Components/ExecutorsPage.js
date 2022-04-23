import {Navbar, Container, Nav} from 'react-bootstrap';
import { gql, useSubscription } from '@apollo/client';
import { useTracked } from "../Container";

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
    const [state, setState] = useTracked();
    const { data, loading } = useSubscription(
        EXECUTORS_STATUS_CHANGE_SUBSCRIPTION,
        { 
            variables: { 
                topicName: "account" + state.accountId
            } 
        }
      );
    return(
        <Container>
            <h1>Executors</h1>
            <p>test {data?.onExecutorStatusChange?.executorId} test {data?.onExecutorStatusChange?.statusCode} test</p>
        </Container>
    )
}

export default ExecutorsPage;