import { Button, Container, Form, Stack, Row, Col } from "react-bootstrap"
import { gql, useMutation } from '@apollo/client';
import { useCallback, useState, useEffect } from 'react';
import LoadingView from "./Loading";
import { useNavigate } from "react-router-dom";
import { useTracked } from "../Container";

const CREATE_FLOW_MUTATION = gql`
    mutation CreateFlow($flowInput: FlowInput!){
    	createFlow(flowInput: $flowInput){
            id,
            flowTaskId,
            name,
            description
        }
    }
`

const NewFlowPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [state, setState] = useTracked();

    const [ createFlow, {loading: flowIsCreating} ] = useMutation(CREATE_FLOW_MUTATION,
        {
            onCompleted(data){
                navigate("../" + data.createFlow.id, {state: {flow: data.createFlow}, replace: true})
            }
        });

    useEffect(()=>{
        if(flowIsCreating)
            setLoading(true);
    }, [flowIsCreating])

    const saveFlow = () => {
        createFlow({
            variables:{
                flowInput:{
                    accountId: state.accountId, 
                    name: name, 
                    description: description
                }
            }
        })
    }

    return(
        <Container>
            {loading && <LoadingView/>}
            <Row>
                <Col>
                    <h1>New Flow</h1>
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
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter description" />
                        </Form.Group>

                        <Container className="text-center">
                            <Button variant="primary" onClick={saveFlow}>
                                Save
                            </Button>
                        </Container>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default NewFlowPage;