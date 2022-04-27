import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useTracked } from "../Container";
import FlowTask from "./FlowTask";
import FlowTaskDiag from "./FlowTaskDiag";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Task from "./Task";
import DraggableTask from "./DraggableTask";

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
            environmentVariables,
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

const TASKS_QUERY = gql`
    query GetTasks{
        tasks{
            id,
            inputType,
            outputType,
            name
        }
    }
`

const ExecSelect = styled(Form.Select)`
    width: 200px;
`;

const FlowDiagramWrapper = styled(Row)`
    overFlow: scroll;
    scrollbar-width: thin;
    height: 50vh;
`;

const PageContainer = styled(Container)`
    margin: 0;
    width: 100%;
    height: 80vh;
    max-width: unset;
`;

const FlowPage = () => {
    const [executors, setExecutors] = useState([]);
    const [flowTasks, setFlowTasks] = useState([])
    const params = useParams();
    const [state, setState] = useTracked();
    const { state: locationState } = useLocation();
    const [editing, setEditing] = useState(false);
    const flow = locationState.flow;

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

    const addTaskToFlow = (taskId, flowTaskId) => {
        console.log(flowTasks.map(f => parseInt(f.id)));
        let newFlowTaskId = Math.max(...flowTasks.map(f => parseInt(f.id))) + 1;
        console.log(taskId + " " + flowTaskId + " " + newFlowTaskId);

        let flowTaskIndex = flowTasks.findIndex(flowTask => flowTask.id == flowTaskId);
        let flowTasksCopy = [...flowTasks,
            {
                id: newFlowTaskId,
                successorsIds: [],
                environmentVariables: [{key: "test"}],
                task: tasks.find(task => task.id == taskId)
            }
        ];
        let flowTask = {...flowTasksCopy[flowTaskIndex]};
        flowTask.successorsIds = [...flowTask.successorsIds, newFlowTaskId];
        flowTasksCopy[flowTaskIndex] = flowTask;
        setFlowTasks(flowTasksCopy);
    }

    const editFlow = () => {
        console.log("start editing");
    }

    const [tasks, setTasks] = useState([]);

    useQuery(TASKS_QUERY, {
        onCompleted: data => setTasks(data?.tasks)
    });

    return(
        <PageContainer>
            <Row>
                <Col>
                    <h1 draggable="true">Flow {flow.name}</h1>
                </Col>
                <Col>
                    <Stack style={{float: "right"}} direction="horizontal" gap={3}>
                        <ExecSelect onChange={chandleSetExecutorId} aria-label="Default select example">
                            <option>Select executor</option>
                            {executors.map(e => <option key={e.id} value={e.id}>{e.name} - {e.status.statusCode}</option>)}
                        </ExecSelect>
                        <Button onClick={startFlow}>Start</Button>
                        <Button onClick={editFlow}>Edit</Button>
                    </Stack>
                </Col>
            </Row>
            <FlowDiagramWrapper>
                <FlowTaskDiag flowTaskId={flow.flowTaskId} flowTasks={flowTasks} addTaskToFlow={addTaskToFlow}/>
            </FlowDiagramWrapper>
            {editing && <Row style={{height: "30vh"}}>
                <Container>
                    <h1>Tasks</h1>
                    {tasks.map(task => <DraggableTask key={task.id} task={task}/>)}
                </Container>
            </Row>}
        </PageContainer>
    )
}


export default FlowPage;