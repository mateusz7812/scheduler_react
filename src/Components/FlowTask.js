import { Container, Row, Col } from "react-bootstrap";
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

const FlowTask = ({flowTask}) =>{
    return(
        <Wrapper>
            <Task style={{margin: "0px"}} task={flowTask.task}/>
            <EnvVariables>
                {flowTask.environmentVariables.map(e => 
                    <Row key={e.key}>
                        <Col>{e.key}:</Col>
                        <Col style={{textAlign: "right"}}>{e.value}</Col>
                    </Row>
                )}
            </EnvVariables>
        </Wrapper>
    )
}

export default FlowTask;