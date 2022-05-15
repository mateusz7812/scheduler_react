import { Container, Row, Col} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Task from "./Task";
import styled from "styled-components";

const Wrapper = styled(Container)`
    padding: 0px;
    border: 1px solid black;
    width: min-content;
    border-radius: 20px;
    margin: 10px;
`;

const EnvVariables = styled(Container)`
    padding: 10px 20px;
`;

const FlowTask = ({flowTask, editing, setEnvVarForFlowTask}) =>{
    return(
        <Wrapper>
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
        </Wrapper>
    )
}

export default FlowTask;