import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import Button from "react-bootstrap/Button";
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import LoadingView from "./Loading";
import { useTracked } from "../Container";

const LOGIN_USER = gql`
    query GetMicrosoftLogin($microsoftAccountId: String) {
    microsoftLogin(microsoftAccountId: $microsoftAccountId){
        id,
        login
    }
}
`

const CREATE_MICROSOFT_ACCOUNT_MUTATION = gql`
    mutation CreateMicrosoftAccount($accountInput: CreateMicrosoftAccountInput!){
        createMicrosoftAccount(accountInput: $accountInput){
            login
        }
    }
`

function ProfileContent() {
    const { instance, accounts, inProgress } = useMsal();
    const [state, setState] = useTracked();

    
    const [getLogin, { loading, error, data }] = useLazyQuery(LOGIN_USER, {
        variables: {
            microsoftAccountId: accounts[0].localAccountId
        }
    });

          
    const [ createMicrosoftAccount ] = useMutation(CREATE_MICROSOFT_ACCOUNT_MUTATION, {
            onCompleted: data => 
                {           
                    getLogin()
                },
            variables:{
                accountInput: {
                    login: accounts[0].username,
                    microsoftAccountId: accounts[0].localAccountId
                }
            }
        }
    );
    
    useEffect(()=>{
        if(data == null){
            createMicrosoftAccount();
        }
        else if(data?.microsoftLogin != undefined){
            setState({
                accountId: data.microsoftLogin.id,
                accountName: data.microsoftLogin.login
            })
        }
    }, [data])

    useEffect(()=>{
        if(accounts[0]){
            getLogin()
        }
    }, [inProgress])

    return (
        <LoadingView/>
    );
};

export default ProfileContent;