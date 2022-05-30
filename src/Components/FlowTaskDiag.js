import { Container, Stack, Row } from "react-bootstrap";
import styled from "styled-components";
import FlowTask from "./FlowTask";

const DiagBlock = styled(Container)`
    margin-left: 10px;
    padding: 0px;
    min-width: 300px;
    min-height: 150px;
    border-left: 1px solid black;
    border-radius: 30px;
    box-sizing: border-box;
`;

const FlowTaskDiag = ({flowTasks, flowTaskId, editing, addTaskToFlow, setEnvVarForFlowTask}) => {
    const onDrop = (event) => {
        event.stopPropagation();
        addTaskToFlow(event.dataTransfer.getData("TaskId"), flowTask?.id);
    }
    const flowTask = flowTasks.find(flowTask => flowTask.id == flowTaskId);


    return(
        <Stack direction="horizontal">
            {flowTaskId !== null 
                ?
                    <FlowTask style={{float: "left"}} flowTask={flowTask} editing={editing} setEnvVarForFlowTask={setEnvVarForFlowTask}/>
                : <Container>
                    <p>Click "Edit" button above and drag tasks to start building your flow</p>
                </Container>
            }
            <DiagBlock style={{float: "left", ...flowTaskId === null ? {position: "absolute", height: "100%", width: "100%", left: "0"} : {}}} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
                {flowTask?.successorsIds.map(id => 
                    <Row key={id}>
                        <FlowTaskDiag flowTaskId={id} flowTasks={flowTasks} addTaskToFlow={addTaskToFlow} editing={editing} setEnvVarForFlowTask={setEnvVarForFlowTask}/>
                    </Row>
                )}
            </DiagBlock>
        </Stack>
    )
}

export default FlowTaskDiag;