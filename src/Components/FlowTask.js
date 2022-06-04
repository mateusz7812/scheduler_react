import { Container, Row, Col} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Task from "./Task";
import styled from "styled-components";
import React, { useRef, forwardRef } from 'react';

const Wrapper = styled(Container)`
    padding: 0px;
    border: 1px solid black;
    width: min-content;
    border-radius: 20px;
    margin: 10px;
    position: relative;
`;

const StatusMarker = styled.div`
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    top: 0;
    right: 0;
    margin: 10px;
`

const EnvVariables = styled(Container)`
    padding: 10px 20px;
`;

const FlowTask = forwardRef(({flowTask, editing, setEnvVarForFlowTask, showStatus, getStatusForFlowTask}, ref) =>{
    const getColor = (statusCode) => {
        switch(statusCode){
            case "ERROR":
                return "red";
            case "PROCESSING":
                return "blue";
            case "DONE":
                return "green";
            default:
                return "gray";
        }
    }

    return(
        <Wrapper ref={ref}>
            <Task style={{margin: "0px"}} task={flowTask?.task}/>
            <EnvVariables>
                {flowTask?.environmentVariables.map(e => 
                    <Row key={e.key}>
                        <Form.Label style={{padding: "2px 7px"}} column sm={2}>{e.key}:</Form.Label>
                        <Col sm={10}>
                            <Form.Control disabled={!editing} size="sm" type='text' value={e.value} onChange={event => setEnvVarForFlowTask(flowTask.id, e.key, event.target.value)}/>
                        </Col>
                    </Row>
                )}
            </EnvVariables>
            { showStatus && 
                <StatusMarker 
                    style={{
                        backgroundColor: getColor(getStatusForFlowTask(flowTask?.id))
                    }}
                />
            }
        </Wrapper>
    )
})

export default FlowTask;