import { Container } from "react-bootstrap";
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTracked } from "../Container";
import { Link } from "react-router-dom";

const FLOWS_QUERY = gql`
    query GetFlowsForAccount($accountId: Int!){
        flowsForAccount(accountId: $accountId){
            id,
            name,
            description
        }
    }
`

const FlowsPage =() =>{
    const [flows, setFlows] = useState([]);
    const [state, setState] = useTracked();

    useQuery(FLOWS_QUERY, {
        variables: {
            accountId: state.accountId
        },
        onCompleted: data => setFlows(data?.flowsForAccount)
    });

    return(
        <Container>
            <h1>Flows</h1>
            {flows.map(t => <Link to={t.id.toString()}>{t.id} {t.name} {t.description}</Link>)}
        </Container>
    )
}

export default FlowsPage;