import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Task from "./Task";
import { Link } from "react-router-dom";

const TASKS_QUERY = gql`
    query GetTasks{
        tasks{
            id,
            inputType,
            outputType,
            name,
            command
        }
    }
`

const TasksPage =() =>{
    const [tasks, setTasks] = useState([]);

    useQuery(TASKS_QUERY, {
        onCompleted: data => setTasks(data?.tasks)
    });

    const newTask = () => {
        console.log("new task")
    }

    return(
        <Container>
            <Row>
                <Col>
                    <h1>Tasks</h1>
                </Col>
                <Col>
                    <Stack style={{float: "right"}} direction="horizontal">
                        <Button as={Link} to="new">New</Button>
                    </Stack>
                </Col>
            </Row>
            <Row>
                {tasks.map(task => 
                    <Col sm="8" md="6" lg="4" xl="3">
                        <Task key={task.id} task={task}/>
                    </Col>
                )}
            </Row>
        </Container>
    )
}

export default TasksPage;