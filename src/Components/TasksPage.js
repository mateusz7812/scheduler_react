import { Container } from "react-bootstrap";
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Task from "./Task";

const TASKS_QUERY = gql`
    query GetTasks{
        tasks{
            id,
            inputType,
            outputType,
            name
        }
    }
`

const TasksPage =() =>{
    const [tasks, setTasks] = useState([]);

    useQuery(TASKS_QUERY, {
        onCompleted: data => setTasks(data?.tasks)
    });

    return(
        <Container>
            <h1>Tasks</h1>
            {tasks.map(task => <Task key={task.id} task={task}/>)}
        </Container>
    )
}

export default TasksPage;