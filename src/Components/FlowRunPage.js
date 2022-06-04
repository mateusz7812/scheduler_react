import { gql, useSubscription, useQuery } from '@apollo/client';
import { useState } from 'react';
import { useParams } from "react-router-dom";
import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FlowTaskDiag from "./FlowTaskDiag";

const STATUSES_FOR_FLOWRUN_QUERY = gql`
  query GetStatusesForFlowRun($flowRunId: Int!){
    statusesForFlowRun(flowRunId: $flowRunId){
        id,
        flowRunId,
        flowTaskId,
        statusCode,
        description,
        date
    }
  }
`

const FLOWRUN_TASKS_STATUS_CHANGE_SUBSCRIPTION = gql`
    subscription OnFlowRunTasksStatusChange($topicName: String){
        onFlowRunTasksStatusChange(topicName: $topicName){
            id,
            flowRunId,
            flowTaskId,
            statusCode,
            description,
            date
        }
    }
`

const PageContainer = styled(Container)`
    margin: 0;
    width: 100%;
    height: 80vh;
    max-width: unset;
`;

const FlowDiagramWrapper = styled(Row)`
    overFlow: scroll;
    scrollbar-width: none;
`;

const FlowRunPage = () => {
    const params = useParams();
    const [ statuses, setStatuses ] = useState([]);
    const { state: locationState } = useLocation();
    const navigate = useNavigate();


    useQuery(STATUSES_FOR_FLOWRUN_QUERY, {
        variables: {
            flowRunId: locationState.run.id
        },
        onCompleted: data => {
            setStatuses([...data?.statusesForFlowRun].sort(status => parseInt(status.date)));
        }
    });
    
    useSubscription(
        FLOWRUN_TASKS_STATUS_CHANGE_SUBSCRIPTION,
        { 
            variables: { 
                topicName: "flowRun" + locationState.run.id
            },
            onSubscriptionData: data => {
                setStatuses([data?.subscriptionData?.data?.onFlowRunTasksStatusChange, ...statuses]);
            } 
        }
      );

    const getStatusForFlowTask = (flowTaskId) => {
        //console.log(statuses.filter(status => status.flowTaskId == flowTaskId));
        return statuses.filter(status => status.flowTaskId == flowTaskId)[0]?.statusCode;
    }

    const getFlowTask = (id) => {
        return locationState.flowTasks.filter(f => f.id == id)[0];
    }

    return (
        <PageContainer>
            <Row>
                <Col>
                    <h1>Flow {locationState.flow.name}, run {locationState.run.id}</h1>
                </Col>
                <Col>
                    <Stack style={{float: "right"}} direction="horizontal" gap={3}>
                        <Button onClick={() => navigate("..", {state: {flow: locationState.flow, flowTasks: locationState.flowTasks}, replace: true})}>Back</Button>
                    </Stack>
                </Col>
            </Row>
            
        <FlowDiagramWrapper style={{height: "60%", position: "relative"}}>
            <FlowTaskDiag flowTaskId={locationState.flow.flowTaskId} flowTasks={locationState.flowTasks} showStatus={true} getStatusForFlowTask={getStatusForFlowTask}/>    
        </FlowDiagramWrapper>
        <Row style={{height: "39%"}}>
            <Container style={{height: "100%"}}>
                <h1>Output</h1>
                <Row style={{height: "100%", overflow: "scroll"}}>
                    {statuses.map(status => 
                        <p style={{margin: "0", ...status.statusCode == "ERROR" ? {color: "red"} : {}}} key={status.id}>{getFlowTask(status.flowTaskId)?.task?.name} - {new Date((status?.date/10000) - Math.abs(new Date(0, 0, 1).setFullYear(1))).toLocaleString()} - {status.statusCode} - {status.description}</p>
                    )}
                </Row>
            </Container>
        </Row>
        </PageContainer>
    )
}

export default FlowRunPage;