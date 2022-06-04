import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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

const Task = ({taskRef, task, style}) => {
    const renderTooltip = props => (
        <Tooltip {...props}>{task?.command}</Tooltip>
      );
    return(
        <OverlayTrigger placement="top" overlay={renderTooltip}>
            <TaskWrapper ref={taskRef} style={style}>
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
        </OverlayTrigger>
    )
}

export default Task;
