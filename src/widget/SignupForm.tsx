import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ELoginErrorDetailMessage } from "../dispatcher/UserDispatcher";
import { AppState } from "../state/AppState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { LoadingIcon } from "./LoadingIcon";
import "./SignupForm.scss";

export interface LoginFormProps {
    onSignup(username: string, password: string): void,
    onGoToLoginPage(): void,
}

interface LoginFormStoreProps {
    signupOperationStatus: OperationStatus,
    getUserOperationStatus: OperationStatus,
}

export const SignupForm = ({onSignup, onGoToLoginPage}: LoginFormProps) => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [isLoading, setIsLoading] = useState(false);
    let [errorTextClass, setErrorTextClass] = useState('error-text-hidden');
    let [errorText, setErrorText] = useState('');
    const {signupOperationStatus, getUserOperationStatus} = useSelector<AppState, LoginFormStoreProps>((state): LoginFormStoreProps => ({
        signupOperationStatus: state.operationStatusState.signupStatus,
        getUserOperationStatus: state.operationStatusState.getUserInfoStatus,
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
        if (signupOperationStatus.status === EOperationStatus.ERROR &&
            signupOperationStatus.detail.description === ELoginErrorDetailMessage.USERNAME_ALREADY_EXISTS) {
            setErrorTextClass('error-text-shown');  
            setErrorText(signupOperationStatus.detail.description);      
        }
    }, [signupOperationStatus]);

    useEffect(() => {
        if (getUserOperationStatus.status === EOperationStatus.INIT ||
            getUserOperationStatus.status === EOperationStatus.IN_PROGRESS ||
            signupOperationStatus.status === EOperationStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [signupOperationStatus, getUserOperationStatus]);

    return (
        <div className="signup-form">
            <div style={{ display: isLoading? 'block': 'none'}}>
                <LoadingIcon></LoadingIcon>
            </div>
            <h1 className="title">Sign up</h1>
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
                <button className="link" onClick={onGoToLoginPage}>Already have an account? Log in now</button>
            </nav>
            <button className="login-button" onClick={() => onSignup(username, password)}>
                Sign up
            </button>
        </div>
    )
}