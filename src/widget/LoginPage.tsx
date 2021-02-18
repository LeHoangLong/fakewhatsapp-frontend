import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginPageController } from '../controller/LoginPageController';
import { UserDispatcher } from '../dispatcher/UserDispatcher';
import { AppState } from '../state/AppState';
import { EOperationStatus, OperationStatus } from '../state/OperationStatusState';
import { UserState } from '../state/UserState';
import { LoadingIcon } from './LoadingIcon';
import { LoginForm } from './LoginForm';
import './LoginPage.scss';
import { SignupForm } from './SignupForm';

interface LoginPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
}


export const LoginPage = () => {
    const loginFormRef = useRef<HTMLInputElement>(null);
    const signUpFormRef = useRef<HTMLInputElement>(null);
    let dispatch = useDispatch();
    let userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    let loginPageController = useRef(new LoginPageController(userDispatcher)).current;
    const {userState, getUserInfoOperationStatus} = useSelector<AppState, LoginPageProps>((state): LoginPageProps => {
        return {
            userState: state.userState,
            getUserInfoOperationStatus: state.operationStatusState.getUserInfoStatus
        }
    });

    useEffect(() => {
        loginPageController.onUserStateChanged(userState)
    }, [userState, loginPageController]);

    function onLoginButtonClickHandler(username: string, password: string) {
        loginPageController.onLogin(username, password);
    }

    function onLoginLinkClicked() {
        if (loginFormRef.current !== null) {
            loginFormRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
        return false;
    }

    function onSignupLinkClicked() {
        if (signUpFormRef.current !== null) {
            signUpFormRef.current.scrollIntoView({
                behavior: "smooth"
            });
        }
        return false;
    }

    function onSignupHandler(username: string, password: string) {
        loginPageController.onSignup(username, password);
    }

    return (
        <div className="login-page">
            <div className="body">
                <div className="form">
                    <div className="form-container" ref={loginFormRef}>
                        <LoginForm onGoToSignupPage={onSignupLinkClicked} onLogin={onLoginButtonClickHandler}></LoginForm>
                    </div>
                    <div className="form-container" ref={signUpFormRef}>
                        <SignupForm onGoToLoginPage={onLoginLinkClicked} onSignup={onSignupHandler}></SignupForm>
                    </div>
                </div>
            </div>
        </div>
    );
}