import {Navbar, Container, Nav} from 'react-bootstrap';
import { Outlet, Link, Navigate } from "react-router-dom";

const AppNavbar = ({accountName}) => {
    return(
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Scheduler</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Tasks</Nav.Link>
                        <Nav.Link href="#link">Flows</Nav.Link>
                        <Nav.Link><Link to="executors">Executors</Link></Nav.Link>
                    </Nav>
                    <Navbar.Text>
                        Signed in as: <a href="#login">{accountName}</a>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar;