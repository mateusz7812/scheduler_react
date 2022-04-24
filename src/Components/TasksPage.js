import { Container } from "react-bootstrap";
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';

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
            {tasks.map(t => <p>{t.id} {t.name} {t.inputType} {t.outputType}</p>)}
        </Container>
    )
}

export default TasksPage;