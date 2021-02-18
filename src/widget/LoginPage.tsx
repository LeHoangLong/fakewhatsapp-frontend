import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginPageController } from '../controller/LoginPageController';
import { UserDispatcher } from '../dispatcher/UserDispatcher';
import { AppState } from '../state/AppState';
import { UserState } from '../state/UserState';
import './LoginPage.scss';

interface LoginPageProps {
    userState: UserState,
}


export const LoginPage = () => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let dispatch = useDispatch();
    let userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    let loginPageController = useRef(new LoginPageController(userDispatcher)).current;
    function onLoginButtonClickHandler() {
        loginPageController.onLogin(username, password);
    }
    const {userState} = useSelector<AppState, LoginPageProps>((state): LoginPageProps => {
        return {
            userState: state.userState
        }
    });

    useEffect(() => {
        loginPageController.onUserStateChanged(userState)
    }, [userState, loginPageController]);

    return (
        <div className="login-page">
            <div className="body">
                <div className="form">
                    <h1 className="title">Login</h1>
                    <div className="input-container">
                        <label>
                            Username
                        </label>
                        <input type="text" autoComplete="new-password" value={username} onChange={(e) => setUsername(e.target.value)}>
                        </input>
                    </div>
                    <div className="input-container">
                        <label>
                            Password
                        </label>
                        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}>
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