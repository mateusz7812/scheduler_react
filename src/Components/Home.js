import React from 'react';
import { useTracked } from "../Container";


const Home = () => {
    const [state, setState] = useTracked();
    return(
        <div>
            logged as {state.accountName} with id {state.accountId}
        </div>
    )
} 

export default Home;