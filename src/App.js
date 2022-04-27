import { Container } from "react-bootstrap";
import { Outlet, Navigate } from "react-router-dom";
import styled from "styled-components";
import AppNavbar from "./Components/AppNavbar";
import { useTracked } from "./Container";

const AppWrapper = styled.div`
  padding-top: 5vh;
`;

function App() {
  const [state, setState] = useTracked();
  if(state.accountId === null){
    return(<Navigate replace to="/login" />)
  }
  return (
    <div>
      <AppNavbar accountName={state.accountName}/>
      <AppWrapper>
        <Outlet/>
      </AppWrapper>
    </div>
  );
}


export default App;
