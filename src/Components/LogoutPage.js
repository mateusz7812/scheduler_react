import React, { useEffect } from 'react';
import { useTracked } from "../Container";
import LoadingView from './Loading';
import { useMsal } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const { instance, accounts, inProgress } = useMsal();
    const [state, setState] = useTracked();
    const navigate = useNavigate();

    useEffect(()=>{
        
        setState({
            accountId: null,
            accountName: null
        })

        if(accounts[0]){
           instance.logoutRedirect().then(navigate("/login")).catch(e => {
                console.error(e);
            });
        } else {
            navigate("/login")
        }
    }, [inProgress])

    return(
        <LoadingView/>
    )
} 

export default LogoutPage;