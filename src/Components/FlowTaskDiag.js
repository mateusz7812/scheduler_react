import { Container, Stack, Row } from "react-bootstrap";
import styled from "styled-components";
import FlowTask from "./FlowTask";
import React, { useRef, forwardRef, createRef } from 'react';
import Xarrow from "react-xarrows";

const DiagBlock = styled(Container)`
    padding: 0px;
    min-width: 300px;
    min-height: 150px;
    border-radius: 30px;
    box-sizing: border-box;
    margin: 20px 50px;
`;

const FlowTaskDiag = forwardRef(({flowTasks, flowTaskId, editing, showStatus, addTaskToFlow, setEnvVarForFlowTask, getStatusForFlowTask}, ref) => {
    if(ref == null){
        ref = createRef();
    }
    const onDrop = (event) => {
        event.stopPropagation();
        addTaskToFlow(event.dataTransfer.getData("TaskId"), flowTask?.id);
    }
    const flowTask = flowTasks.find(flowTask => flowTask.id == flowTaskId);

    let NextRefs = [];

    return(
        <Stack direction="horizontal">
            {flowTaskId !== null 
                ?
                    <FlowTask 
                        ref={ref}
                        style={{float: "left"}} 
                        flowTask={flowTask} 
                        editing={editing} 
                        setEnvVarForFlowTask={setEnvVarForFlowTask} 
                        showStatus={showStatus} 
                        getStatusForFlowTask={getStatusForFlowTask}
                    />
                : <Container>
                    <p>Click "Edit" button above and drag tasks to start building your flow</p>
                </Container>
            }
            <DiagBlock 
                style={{
                        float: "left", 
                        ...flowTaskId === null 
                            ? {position: "absolute", height: "100%", width: "100%", left: "0"} 
                            : {}
                    }} 
                onDrop={onDrop} 
                onDragOver={e => e.preventDefault()}
            >
                {flowTask?.successorsIds.map(id => {
                    const nextRef = createRef();
                    NextRefs.push(nextRef);
                    return(
                        <Row key={id}>
                            <FlowTaskDiag 
                                ref={nextRef}
                                flowTaskId={id} 
                                flowTasks={flowTasks} 
                                addTaskToFlow={addTaskToFlow} 
                                editing={editing} 
                                setEnvVarForFlowTask={setEnvVarForFlowTask} 
                                showStatus={showStatus} 
                                getStatusForFlowTask={getStatusForFlowTask}
                            />
                            <Xarrow
                                start={ref}
                                end={nextRef}
                            />
                        </Row>
                    )
                })}
            </DiagBlock>
        </Stack>
    )
})

FlowTaskDiag.defaultProps = {
    editing: false, 
    addTaskToFlow: () => null, 
    setEnvVarForFlowTask: () => null
}

export default FlowTaskDiag;