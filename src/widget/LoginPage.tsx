import React from 'react';
import './LoginPage.scss';

export const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="body">
                <div className="form">
                    <h1 className="title">Login</h1>
                    <div className="input-container">
                        <label>
                            Username
                        </label>
                        <input type="text" autoComplete="new-password">
                        </input>
                    </div>
                    <div className="input-container">
                        <label>
                            Password
                        </label>
                        <input type="password" autoComplete="new-password">
                        </input>
                    </div>
                    <nav className="sign-up-link-container">
                        <a className="sign-up-link" href="#sign-up">Not a member yet? Sign up now</a>
                    </nav>
                    <button className="login-button">
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
}