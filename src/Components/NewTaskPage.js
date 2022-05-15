import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { gql, useMutation } from '@apollo/client';
import { useCallback, useState, useEffect } from 'react';

const CREATE_TASK_MUTATION = gql`
    mutation CreateTask($taskInput: TaskInput){
        createTask(taskInput: $taskInput){
            id
        }
    }
`

const NewTaskPage = () => {
    const [name, setName] = useState("");
    const [inputType, setInputType] = useState("");
    const [outputType, setOutputType] = useState("");
    const [command, setCommand] = useState("");
    const [variables, setVariables] = useState([{key:"", value: ""}])

    const addVariable = () => {
        if(variables.findIndex(v => v.key == "") == -1)
            setVariables([
                ...variables,
                {key: "", value: ""}
            ])
    }

    const updateVariableName = (index) => (event) => {
        let copyVariables = [...variables];
        let variable = copyVariables[index];
        variable.key = event.target.value;
        copyVariables[index] = variable;
        setVariables(copyVariables);
    }

    const updateVariableValue = (index) => (event) => {
        let copyVariables = [...variables];
        let variable = copyVariables[index];
        variable.value = event.target.value;
        copyVariables[index] = variable;
        setVariables(copyVariables);
    }

    const [ createTask ] = useMutation(CREATE_TASK_MUTATION);

    const saveTask = () => {
        createTask({
            variables:{
                taskInput:{
                    name: name,
                    inputType: inputType,
                    outputType: outputType,
                    command: command,
                    defaultEnvironmentVariables: variables
                }
            }
        })
    }


    return(
        <Container>
            <Row>
                <Col>
                    <h1>New Task</h1>
                </Col>
            </Row>
            <Row  className="justify-content-md-center">
                <Col lg="9" xl="7" xxl="6">
                    <Form>
                        <Form.Group className="mb-3" controlId="formInputType">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formInputType">
                            <Form.Label>Input type</Form.Label>
                            <Form.Control type="text" value={inputType} onChange={(event) => setInputType(event.target.value)} placeholder="Enter type" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formOutputType">
                            <Form.Label>Output type</Form.Label>
                            <Form.Control type="text" value={outputType} onChange={(event) => setOutputType(event.target.value)} placeholder="Enter type" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formOutputType">
                            <Form.Label>Powershell command</Form.Label>
                            <Form.Control type="text" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Enter Powershell command" />
                        </Form.Group>
                        <Form.Label>Environment variables</Form.Label>
                        <Stack>
                            {variables.map((v, i) => 
                                <Row key={i}>
                                    <Col>
                                        <Form.Control value={v.key} type="text" placeholder="Variable name" onChange={updateVariableName(i)}/>
                                    </Col>
                                    <Col>
                                        <Form.Control value={v.value} type="text" placeholder="Variable default value" onChange={updateVariableValue(i)}/>
                                    </Col>
                                </Row>
                            )}
                        </Stack>
                        <Button variant="primary" onClick={addVariable}>
                                Add Variable
                        </Button>
                        <Container className="text-center">
                            <Button variant="primary" onClick={saveTask}>
                                Save
                            </Button>
                        </Container>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default NewTaskPage;