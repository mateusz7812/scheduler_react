import { Button, Container, Form } from "react-bootstrap"
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTracked } from "../Container";

const EXECUTORS_FOR_ACCOUNT_QUERY = gql`
    query GetExecutorsForAccount($accountId: Int!){
        executorsForAccount(accountId: $accountId){
            id,
            name,
            status{
                statusCode
            }
        }
}
`

const FLOWTASKS_FOR_FLOW_QUERY = gql`
    query GetFlowTasksForFlow($flowId: Int!){
        flowTasksForFlow(flowId: $flowId){
            id,
            successorsIds,
            task{
                inputType,
                outputType,
                name
            }
        }
    }
`

const START_FLOW_ON_EXECUTOR_MUTATION = gql`
    mutation StartFlowOnExecutor($flowId: Int!, $executorId: Int!){
        createFlowStart(flowId: $flowId, executorId: $executorId){
            id,
            name
        }
    }
`

const FlowPage = () => {
    const [executors, setExecutors] = useState([]);
    const [flowTasks, setFlowTasks] = useState([])
    const params = useParams();
    const [state, setState] = useTracked();

    useQuery(EXECUTORS_FOR_ACCOUNT_QUERY, {
        variables: {
            accountId: state.accountId
        },
        onCompleted: data => setExecutors(data?.executorsForAccount)
    });

    useQuery(FLOWTASKS_FOR_FLOW_QUERY, {
        variables: {
            flowId: parseInt(params.flowId)
        },
        onCompleted: data => setFlowTasks(data?.flowTasksForFlow)
    });

    const [ executorId, setExecutorId ] = useState(0);
    const [ startFlow, { data, loading, error } ] = useMutation(START_FLOW_ON_EXECUTOR_MUTATION, {
        variables: {
            flowId: parseInt(params.flowId),
            executorId: executorId
        }
    });

    const chandleSetExecutorId = (e) =>
        setExecutorId(parseInt(e.target.value));

    return(
        <Container>
            Flow test
            {flowTasks.map(f => <p key={f.id}>{f.task.name}</p>)}
            <p>executor id: {executorId}</p>
            <Form.Select onChange={chandleSetExecutorId} aria-label="Default select example">
                <option>Open this select menu</option>
                {executors.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </Form.Select>
            <Button onClick={startFlow} >Start flow</Button>
        </Container>
    )
}


export default FlowPage;