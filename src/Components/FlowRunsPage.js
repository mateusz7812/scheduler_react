import { gql, useSubscription, useQuery } from '@apollo/client';
import { useTracked } from "../Container";
import { useState } from 'react';
import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

const FLOWRUNS_FOR_FLOW_QUERY = gql`
  query GetFlowRunsForFlow($flowId: Int!){
    flowRunsForFlow(flowId: $flowId){
      id,
      runDate,
      flowId,
      executorId
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

const FlowRunsPage = () => {
    const [flowRuns, setFlowRuns] = useState([]);
    const params = useParams();
    const { state: locationState } = useLocation();

    useQuery(FLOWRUNS_FOR_FLOW_QUERY, {
        variables: {
            flowId: parseInt(params.flowId)
        },
        onCompleted: data => setFlowRuns(data?.flowRunsForFlow)
    });

    return(
        <Container>
            <h1>{locationState.flow.name} runs</h1>
            <HeaderRow>
                <Col md="1">Id</Col> 
                <Col md="3">RunDate</Col> 
                <Col md="3">ExecutorId</Col>
                <Col md="3">Status</Col>
            </HeaderRow>
            {flowRuns?.map(f =>
                <FlowRow>
                    <Col md="1">{f.id}</Col> 
                    <Col md="3">{new Date((f.runDate/10000) - Math.abs(new Date(0, 0, 1).setFullYear(1))).toLocaleString()}</Col> 
                    <Col md="3">{f.executorId}</Col>
                    <Col md="3">{}</Col>
                </FlowRow>
                )}
        </Container>
    )
}

export default FlowRunsPage;