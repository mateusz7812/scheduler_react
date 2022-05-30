import { gql, useSubscription, useQuery } from '@apollo/client';
import { useTracked } from "../Container";
import { useState } from 'react';
import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const EXECUTORS_FOR_ACCOUNT_QUERY = gql`
    query GetExecutorsForAccount($accountId: Int!){
        executorsForAccount(accountId: $accountId){
            id,
            name,
            description,
            status{
                statusCode,
                date
            }
        }
    }
`

const EXECUTORS_STATUS_CHANGE_SUBSCRIPTION = gql`
    subscription OnExecutorStatusChange($topicName: String){
        onExecutorStatusChange(topicName: $topicName){
            id,
            executorId,
            statusCode,
            date
        }
    }
`

const HeaderRow = styled(Row)`
    font-size: 140%;
`

const FlowRow = styled(Row)`
    :hover{
        background-color: lightgray;
    }
`

const ExecutorsPage = () => {
    const [executors, setExecutors] = useState([]);
    const [state, setState] = useTracked();

    useQuery(EXECUTORS_FOR_ACCOUNT_QUERY, {
        variables: {
            accountId: state.accountId
        },
        onCompleted: data => setExecutors(data?.executorsForAccount)
    });

    useSubscription(
        EXECUTORS_STATUS_CHANGE_SUBSCRIPTION,
        { 
            variables: { 
                topicName: "account" + state.accountId
            },
            onSubscriptionData: data => {
                let index = executors.findIndex(e => e.id == data?.subscriptionData?.data?.onExecutorStatusChange?.executorId);
                console.log(index);
                let updatedExecutors = [...executors];
                let updatedExecutor = {...executors[index]};
                updatedExecutor.status = data?.subscriptionData?.data?.onExecutorStatusChange
                updatedExecutors[index] = updatedExecutor;
                setExecutors(updatedExecutors);
            } 
        }
      );
    return(
        <Container>
            <h1>Executors</h1>
            <HeaderRow>
                <Col md="1">Id</Col> 
                <Col md="2">Name</Col> 
                <Col md="5">Description</Col>
                <Col md="2">Status</Col>
                <Col md="2">Last usage</Col>
            </HeaderRow>
            {executors?.map(e =>
                <FlowRow>
                    <Col md="1">{e.id}</Col> 
                    <Col md="2">{e.name}</Col> 
                    <Col md="5">{e.description}</Col>
                    <Col md="2">{e.status?.statusCode}</Col>
                    <Col md="2">{new Date((e.status?.date/10000) - Math.abs(new Date(0, 0, 1).setFullYear(1))).toLocaleString()}</Col>
                </FlowRow>
                )}
        </Container>
    )
}

export default ExecutorsPage;