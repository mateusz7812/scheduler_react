import { Outlet, Navigate } from "react-router-dom";
import AppNavbar from "./Components/AppNavbar";
import { useTracked } from "./Container";

function App() {
  const [state, setState] = useTracked();
  if(state.accountId === null){
    return(<Navigate replace to="/login" />)
  }
  return (
    <div>
      <AppNavbar accountName={state.accountName}/>
      <Outlet/>
    </div>
  );
}


export default App;
