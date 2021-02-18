import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { LoginPage } from "./LoginPage";
import { MainPage } from "./MainPage";

export const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login">
                    <LoginPage></LoginPage>
                </Route>
                <Route path="/sign-up"></Route>
                <Route path="/">
                    <MainPage></MainPage>
                </Route>
            </Switch>
        </HashRouter>
    );
}

export default App;