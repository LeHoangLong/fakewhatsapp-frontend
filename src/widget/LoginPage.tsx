import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginPageController } from '../controller/LoginPageController';
import { UserDispatcher } from '../dispatcher/UserDispatcher';
import { AppState } from '../state/AppState';
import { EOperationStatus, OperationStatus } from '../state/OperationStatusState';
import { UserState } from '../state/UserState';
import { LoginForm } from './LoginForm';
import './LoginPage.scss';
import { SignupForm } from './SignupForm';

interface LoginPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
    loginOperationStatus: OperationStatus,
    signupOperationStatus: OperationStatus,
}


export const LoginPage = () => {
    let [isLoading, setIsLoading] = useState(false);
    const loginFormRef = useRef<HTMLInputElement>(null);
    const signUpFormRef = useRef<HTMLInputElement>(null);
    let dispatch = useDispatch();
    let userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    let loginPageController = useRef(new LoginPageController(userDispatcher)).current;
    const {userState, getUserInfoOperationStatus, loginOperationStatus, signupOperationStatus} = useSelector<AppState, LoginPageProps>((state): LoginPageProps => {
        return {
            userState: state.userState,
            getUserInfoOperationStatus: state.operationStatusState.getUserInfoStatus,
            loginOperationStatus: state.operationStatusState.loginStatus,
            signupOperationStatus: state.operationStatusState.signupStatus,
        }
    });

    useEffect(() => {
        if (getUserInfoOperationStatus.status === EOperationStatus.INIT ||
            getUserInfoOperationStatus.status === EOperationStatus.IN_PROGRESS ||
            loginOperationStatus.status === EOperationStatus.IN_PROGRESS ||
            signupOperationStatus.status === EOperationStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [loginOperationStatus, getUserInfoOperationStatus, signupOperationStatus]);

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
                        <LoginForm isLoading={isLoading} onGoToSignupPage={onSignupLinkClicked} onLogin={onLoginButtonClickHandler}></LoginForm>
                    </div>
                    <div className="form-container" ref={signUpFormRef}>
                        <SignupForm isLoading={isLoading} onGoToLoginPage={onLoginLinkClicked} onSignup={onSignupHandler}></SignupForm>
                    </div>
                </div>
            </div>
        </div>
    );
}