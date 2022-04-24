import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import LoginForm from './LoginForm';
import { Navigate } from "react-router-dom";
import { useTracked } from "../Container";
import { useNavigate } from "react-router-dom";

const LOGIN_USER = gql`
    query GetLogin($login: String, $password: String) {
        login(login: $login, password: $password){
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
        if(data?.login != undefined){
            setState({
                accountId: data.login.id,
                accountName: data.login.login
            })
            navigate("../", { replace: true });        
        }
    }, [data])

    return(
        <div>
            <LoginForm login={login} setLogin={setLogin} password={password} setPassword={setPassword} getLogin={getLogin}/>
        </div>
    )
}

export default LoginPage;