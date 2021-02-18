import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginPageController } from '../controller/LoginPageController';
import { UserDispatcher, ELoginErrorDetailMessage } from '../dispatcher/UserDispatcher';
import { AppState } from '../state/AppState';
import { EOperationStatus, OperationStatus } from '../state/OperationStatusState';
import { UserState } from '../state/UserState';
import { LoadingIcon } from './LoadingIcon';
import './LoginPage.scss';

interface LoginPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
    loginOperationStatus: OperationStatus,
}


export const LoginPage = () => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [isLoading, setIsLoading] = useState(true);
    let [errorTextClass, setErrorTextClass] = useState('error-text-hidden');
    let dispatch = useDispatch();
    let userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    let loginPageController = useRef(new LoginPageController(userDispatcher)).current;
    function onLoginButtonClickHandler() {
        loginPageController.onLogin(username, password);
    }
    const {userState, getUserInfoOperationStatus, loginOperationStatus} = useSelector<AppState, LoginPageProps>((state): LoginPageProps => {
        return {
            userState: state.userState,
            getUserInfoOperationStatus: state.operationStatusState.getUserInfoStatus,
            loginOperationStatus: state.operationStatusState.loginStatus,
        }
    });

    useEffect(() => {
        loginPageController.onGetUserInfoOperationStatusChanged(getUserInfoOperationStatus.status, userState);
    }, [getUserInfoOperationStatus, userState, loginPageController]);

    useEffect(() => {
        loginPageController.onUserStateChanged(userState)
    }, [userState, loginPageController]);

    useEffect(() => {
        if (getUserInfoOperationStatus.status === EOperationStatus.INIT || //init status here because on start up, we want to fetch data first before showing anything
            getUserInfoOperationStatus.status === EOperationStatus.IN_PROGRESS ||
            loginOperationStatus.status === EOperationStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [getUserInfoOperationStatus, loginOperationStatus]);

    useEffect(() => {
        console.log('loginOperationStatus');
        console.log(loginOperationStatus);
        if (loginOperationStatus.status === EOperationStatus.ERROR &&
            loginOperationStatus.detail.description === ELoginErrorDetailMessage.INVALID_CREDENTIALS) {
            console.log('show error text');
            setErrorTextClass('error-text-shown');        
        }
    }, [loginOperationStatus]);

    function onUsernameChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
        setErrorTextClass('error-text-hidden');   
    }

    function onPasswordChanged(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        setErrorTextClass('error-text-hidden');   
    }


    if (isLoading) {
        return (
            <div className="loading-icon-container">
                <LoadingIcon></LoadingIcon>
            </div>
        ) 
    } else {
        return (
            <div className="login-page">
                <div className="body">
                    <div className="form">
                        <h1 className="title">Login</h1>
                        <div className={errorTextClass}>
                            Username or password not found
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
                        <nav className="sign-up-link-container">
                            <a className="sign-up-link" href="#sign-up">Not a member yet? Sign up now</a>
                        </nav>
                        <button className="login-button" onClick={onLoginButtonClickHandler}>
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}