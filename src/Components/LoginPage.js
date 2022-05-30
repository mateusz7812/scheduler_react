import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import LoginForm from './LoginForm';
import { Navigate } from "react-router-dom";
import { useTracked } from "../Container";
import { useNavigate } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import ProfileContent from "./ProfileContent";

const LOGIN_USER = gql`
    query GetLocalLogin($login: String, $password: String) {
        localLogin(login: $login, password: $password){
            id,
            login
        }
    }
`

const LoginPage = () => {
    const [login, setLogin] = useState("testLogin");
    const [password, setPassword] = useState("testPassword");
    const [state, setState] = useTracked();
    let navigate = useNavigate();
    
    const [getLogin, { loading, error, data }] = useLazyQuery(LOGIN_USER, {
        variables: {
            login: login,
            password: password
        }
    });

    useEffect(()=>{
        if(data?.localLogin != undefined){
            setState({
                accountId: data.localLogin.id,
                accountName: data.localLogin.login
            })
        }
    }, [data])

    useEffect(() => {
        if(state.accountId !== null && state.accountName !== null)
            navigate("../", { replace: true });        
    }, [state])

    return(
        <div>
            <AuthenticatedTemplate>
                <ProfileContent/>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <LoginForm login={login} setLogin={setLogin} password={password} setPassword={setPassword} getLogin={getLogin}/>
            </UnauthenticatedTemplate>
        </div>
    )
}

export default LoginPage;