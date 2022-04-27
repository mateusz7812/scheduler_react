import { Container, Stack, Row } from "react-bootstrap";
import styled from "styled-components";
import FlowTask from "./FlowTask";

const DiagBlock = styled(Container)`
    margin: 10px;
    padding: 0px;
    min-width: 300px;
    min-height: 300px;
    border: 1px solid black;
`;

const FlowTaskDiag = ({flowTask, getFlowTaskDiagById, addTaskToFlow}) => {
    const onDrop = (event) => {
        event.stopPropagation();
        addTaskToFlow(event.dataTransfer.getData("TaskId"), flowTask.id);
    }

    return(
        <Stack direction="horizontal">
            <FlowTask style={{float: "left"}} flowTask={flowTask}/>
            <DiagBlock  style={{float: "left"}} onDrop={onDrop} onDragOver={e => e.preventDefault()}>
                {flowTask.successorsIds.map(id => <Row key={id}>{getFlowTaskDiagById(id)}</Row>)}
            </DiagBlock>
        </Stack>
    )
}

export default FlowTaskDiag;