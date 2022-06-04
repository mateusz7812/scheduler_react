import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from '@apollo/client';
import { useCallback, useState, useEffect } from 'react';
import { useTracked } from "../Container";
import FlowTask from "./FlowTask";
import FlowTaskDiag from "./FlowTaskDiag";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Task from "./Task";
import DraggableTask from "./DraggableTask";
import { useNavigate } from "react-router-dom";


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
                name,
                command
            }
        }
    }
`

const START_FLOW_ON_EXECUTOR_MUTATION = gql`
    mutation StartFlowOnExecutor($flowId: Int!, $executorId: Int!){
        createFlowStart(flowId: $flowId, executorId: $executorId){
            id,
            runDate,
            flowId,
            executorId,
            status
        }
    }
`

const TASKS_QUERY = gql`
    query GetTasks{
        tasks{
            id,
            inputType,
            outputType,
            name,
            defaultEnvironmentVariables,
            command
        }
    }
`

const CREATE_FLOWTASKS_MUTATION = gql`
    mutation CreateFlowTasks($flowTaskNumber: Int!){
        createFlowTasks(flowTaskNumber: $flowTaskNumber){
            id
        }
    }
`

const UPDATE_FLOWTASKS_MUTATION = gql`
    mutation UpdateFlowTasks($flowTasksToUpdate: [UpdateFlowTaskInput]){
        updateFlowTasks(flowTasks: $flowTasksToUpdate){
            id
        }
    }
`
const UPDATE_FLOW_MUTATION = gql`
mutation UpdateFlow($flow: UpdateFlowInput!){
    updateFlow(flow: $flow){
      id
    }
  }
`

const ExecSelect = styled(Form.Select)`
    width: 200px;
`;

const FlowDiagramWrapper = styled(Row)`
    overFlow: scroll;
    scrollbar-width: none;
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
    const [flow, setFlow] = useState(locationState.flow);
    const [ changedFlowTasksIds, setChangedFlowTasksIds ] = useState([]);
    const [rootFlowTaskIdChanged, setRootFlowTaskIdChanged] = useState(false);
    const navigate = useNavigate();

    const setChanged = (flowTaskId) => {
        if(!changedFlowTasksIds.includes(flowTaskId))
        {
            setChangedFlowTasksIds([...changedFlowTasksIds, flowTaskId]);
        }
    }

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
    const [ startFlow ] = useMutation(START_FLOW_ON_EXECUTOR_MUTATION, {
        variables: {
            flowId: parseInt(params.flowId),
            executorId: executorId
        },
        onCompleted: data => navigate(`runs/${data.createFlowStart.id}`, {state: {flow: flow, flowTasks: flowTasks, run: data.createFlowStart}, replace: true})
    });

    const chandleSetExecutorId = (e) =>
        setExecutorId(parseInt(e.target.value));

    const [newFlowTasksIds, setNewFlowTasksIds] = useState([]);

    const addTaskToFlow = (taskId, flowTaskId) => {
        let newFlowTaskId = Math.max(...flowTasks.map(f => parseInt(f.id))) + 1;
        setNewFlowTasksIds([...newFlowTasksIds, newFlowTaskId])
        let task = tasks.find(task => task.id == taskId);
        let flowTasksCopy = [...flowTasks,
            {
                id: newFlowTaskId,
                successorsIds: [],
                environmentVariables: task.defaultEnvironmentVariables,
                task: task
            }
        ];
        if(flowTaskId != null)
        {
            let flowTaskIndex = flowTasks.findIndex(flowTask => flowTask.id == flowTaskId);
            let flowTask = {...flowTasksCopy[flowTaskIndex]};
            flowTask.successorsIds = [...flowTask.successorsIds, newFlowTaskId];
            flowTasksCopy[flowTaskIndex] = flowTask;    
        }
        else {
            let flowCopy = {...flow};
            flowCopy.flowTaskId = newFlowTaskId;
            setFlow(flowCopy);
            setRootFlowTaskIdChanged(true);
        }
        setFlowTasks(flowTasksCopy);
    }

    const editFlow = () => {
        setEditing(true);
    }

    const changeFlowTaskId = (originalId, createdId, flowTasksCopy) => {
        var changed = [];
        var listIndex = flowTasksCopy.findIndex(ft => ft.id == originalId);
        let flowTask = {...flowTasksCopy[listIndex]};
        flowTask.id = createdId;
        flowTasksCopy[listIndex] = flowTask;
        changed.push(flowTask.id);

        var listIndexes = flowTasksCopy.filter(ft => ft.successorsIds.includes(originalId)).map(ft => flowTasksCopy.findIndex(f => f.id == ft.id));
        for (let index = 0; index < listIndexes.length; index++) {
            const listIndex = listIndexes[index];
            let flowTask = {...flowTasksCopy[listIndex]};
            changed.push(flowTask.id);
            flowTask.successorsIds.splice(flowTask.successorsIds.findIndex(id => id == originalId), 1);
            flowTask.successorsIds = [...flowTask.successorsIds, createdId];
            flowTasksCopy[listIndex] = flowTask;
        }
        if(originalId == flow.flowTaskId){
            let flowCopy = {...flow};
            flowCopy.flowTaskId = createdId;
            setFlow(flowCopy);
        }
        return changed;
    }


    const [ updateFlow ] = useMutation(UPDATE_FLOW_MUTATION);

    const [ updateFlowTasks ] = useMutation(UPDATE_FLOWTASKS_MUTATION);

    const handleFlowTasksUpdate = () => {
        updateFlowTasks({
            variables: {
                flowTasksToUpdate: changedFlowTasksIds
                                        .map(id => 
                                            flowTasks.find(ft => ft.id == id)
                                            )
                                        .map(ft => { return {
                                            id: ft.id,
                                            taskId: ft.taskId,
                                            environmentVariables: ft.environmentVariables,
                                            successorsIds: ft.successorsIds 
                                        }})
            },
            onCompleted: data => {
                if(rootFlowTaskIdChanged){
                    updateFlow({variables:{
                        flow: {
                            id: flow.id,
                            flowTaskId: flow.flowTaskId
                        }
                    }})    
                }
            }
        })
    }

    const [ saving, setSaving ] = useState(false);

    useEffect(() => {
        if(saving == true)
            handleFlowTasksUpdate()
        setSaving(false);
    }, [saving])

    const handleFlowTasksCreate = (createdFlowTaskIds) => {
        var flowTasksCopy = [...flowTasks];
        setChangedFlowTasksIds([...new Set([...changedFlowTasksIds, ...newFlowTasksIds.map((id, i) => changeFlowTaskId(id, createdFlowTaskIds[i].id, flowTasksCopy)).flat()])]);
        setFlowTasks(flowTasksCopy);
        setNewFlowTasksIds([]);
        setSaving(true);
    } 

    const [ createFlowTasks ] = useMutation(CREATE_FLOWTASKS_MUTATION, {onCompleted: data => 
            {
                handleFlowTasksCreate(data.createFlowTasks)
            }
        }
    );

    const saveFlow = () => {
        createFlowTasks({
            variables: {
                flowTaskNumber: newFlowTasksIds.length
            }
        })
        setEditing(false);
    }

    const setEnvVarForFlowTask = (flowTaskId, key, value) => {
        let flowTaskIndex = flowTasks.findIndex(flowTask => flowTask.id == flowTaskId);
        let flowTasksCopy = [...flowTasks];
        let flowTask = {...flowTasksCopy[flowTaskIndex]};
        let varIndex = flowTask.environmentVariables.findIndex(e => e.key == key);
        let envVariables = [...flowTask.environmentVariables];
        envVariables[varIndex] = {key: key, value: value};
        flowTask.environmentVariables = envVariables;
        flowTasksCopy[flowTaskIndex] = flowTask;
        setChanged(flowTask.id);
        setFlowTasks(flowTasksCopy);
    }

    const [tasks, setTasks] = useState([]);

    useQuery(TASKS_QUERY, {
        onCompleted: data => setTasks(data?.tasks)
    });

    return(
        <PageContainer>
            <Row>
                <Col>
                    <h1>Flow {flow.name}</h1>
                </Col>
                <Col>
                    <Stack style={{float: "right"}} direction="horizontal" gap={3}>
                        {!editing && 
                        <>
                            <Button onClick={() => navigate("runs", {state: {flow: flow, flowTasks: flowTasks}, replace: true})}>Runs</Button>
                            <ExecSelect onChange={chandleSetExecutorId} aria-label="Default select example">
                                <option>Select executor</option>
                                {executors.map(e => <option key={e.id} value={e.id}>{e.name} - {e.status.statusCode}</option>)}
                            </ExecSelect>
                            <Button onClick={startFlow}>Start</Button>
                            <Button onClick={editFlow}>Edit</Button>
                        </>
                        }
                        {editing && 
                            <Button onClick={saveFlow}>Save</Button>
                        }
                    </Stack>
                </Col>
            </Row>
            {!editing && 
                <Row>
                    <Col md="6">
                        {flow.description}
                    </Col>
                </Row>
            }
            <FlowDiagramWrapper style={{height: editing ? "75%" : "100%", position: "relative"}}>
               <FlowTaskDiag editing={editing} flowTaskId={flow.flowTaskId} flowTasks={flowTasks} addTaskToFlow={addTaskToFlow} setEnvVarForFlowTask={setEnvVarForFlowTask}/>    
            </FlowDiagramWrapper>
            {editing && <Row style={{height: "20%", }}>
                <Container>
                    <h1>Tasks</h1>
                    <Row>
                        {tasks.map(task => 
                            <Col key={task.id} xs={3} style={{width: "270px"}}>
                                <DraggableTask task={task}/>
                            </Col>
                        )}
                    </Row>
                </Container>
            </Row>}
        </PageContainer>
    )
}


export default FlowPage;