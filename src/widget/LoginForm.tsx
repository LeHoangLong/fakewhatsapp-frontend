import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ELoginErrorDetailMessage } from "../dispatcher/UserDispatcher";
import { AppState } from "../state/AppState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { LoadingIcon } from "./LoadingIcon";
import "./LoginForm.scss"

export interface LoginFormProps {
    onLogin(username: string, password: string): void,
    onGoToSignupPage(): void,
    isLoading: boolean,
}

interface LoginFormStoreProps {
    loginOperationStatus: OperationStatus,
}

export const LoginForm = ({onLogin, onGoToSignupPage, isLoading}: LoginFormProps) => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [errorTextClass, setErrorTextClass] = useState('error-text-hidden');
    let [errorText, setErrorText] = useState('');
    const {loginOperationStatus } = useSelector<AppState, LoginFormStoreProps>((state): LoginFormStoreProps => ({
        loginOperationStatus: state.operationStatusState.loginStatus,
    }));

    function onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
        setErrorTextClass('error-text-hidden');   
        setErrorText('');
    }

    function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        setErrorTextClass('error-text-hidden');   
        setErrorText('');
    }
    
    useEffect(() => {
        if (loginOperationStatus.status === EOperationStatus.ERROR &&
            loginOperationStatus.detail.description === ELoginErrorDetailMessage.INVALID_CREDENTIALS) {
            setErrorTextClass('error-text-shown');  
            setErrorText(loginOperationStatus.detail.description);      
        }
    }, [loginOperationStatus]);
    
    return (
        <div className="login-form">
            <div style={{ display: isLoading? 'block': 'none'}}>
                <LoadingIcon></LoadingIcon>
            </div>
            <h1 className="title">Login</h1>
            <div className={errorTextClass}>
                {errorText}
            </div>
            <div className="input-container">
                <label>
                    Username
                </label>
                <input type="text" autoComplete="new-password" value={username} onChange={onUsernameChanged}>
                </input>
            </div>
            <div className="input-container">
                <label>
                    Password
                </label>
                <input type="password" autoComplete="new-password" value={password} onChange={onPasswordChanged}>
                </input>
            </div>
            <nav className="link-container">
                <button className="link" onClick={onGoToSignupPage}>Not a member yet? Sign up now</button>
            </nav>
            <button className="login-button" onClick={() => onLogin(username, password)}>
                Log In
            </button>
        </div>
    )
}