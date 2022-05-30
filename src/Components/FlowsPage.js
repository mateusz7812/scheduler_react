import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTracked } from "../Container";
import { Link } from "react-router-dom";
import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const FLOWS_QUERY = gql`
    query GetFlowsForAccount($accountId: Int!){
        flowsForAccount(accountId: $accountId){
            id,
            name,
            description,
            flowTaskId
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

const FlowsPage =() =>{
    const [flows, setFlows] = useState([]);
    const [state, setState] = useTracked();
    const navigate = useNavigate();

    useQuery(FLOWS_QUERY, {
        variables: {
            accountId: state.accountId
        },
        onCompleted: data => setFlows(data?.flowsForAccount)
    });

    return(
        <Container>
            <Row>
                <Col>
            <h1>Flows</h1>
                </Col>
                <Col>
                    <Stack style={{float: "right"}} direction="horizontal">
                        <Button as={Link} to="new">New</Button>
                    </Stack>
                </Col>
            </Row>
            <HeaderRow>
                <Col md="1">Id</Col> 
                <Col md="3">Name</Col> 
                <Col md="6">Description</Col>
                <Col md="2">
                </Col>
            </HeaderRow>
            {flows.map(t => 
                <FlowRow onClick={() => navigate(t.id.toString(), {state: {flow: t}, replace: true})}>
                    <Col md="1">{t.id}</Col> 
                    <Col md="3">{t.name}</Col> 
                    <Col md="6">{t.description}</Col>
                    <Col md="2">
                    </Col>
                </FlowRow>
                )}
        </Container>
    )
}

export default FlowsPage;