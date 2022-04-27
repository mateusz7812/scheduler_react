import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

const TaskWrapper = styled(Container)`
    border: 1px solid black;
    width: 250px;
    padding: 10px;
    line-height: 25px;
    border-radius: 20px;
    margin: 10px;
`;

const StyledCol = styled(Col)`
    text-align: center;
`;

const TypeCol = styled(StyledCol)`
    font-size: 12px;
`;

const Task = ({task, style}) => {
    return(
        <TaskWrapper style={style}>
            <Row>
                <StyledCol>
                    {task?.name}
                </StyledCol>
            </Row>
            <Row>
                <TypeCol>
                    {task?.inputType}
                </TypeCol>
                <TypeCol>
                    {task?.outputType}
                </TypeCol>
            </Row>
        </TaskWrapper>
    )
}

export default Task;
