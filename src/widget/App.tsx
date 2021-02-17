import { UserState } from "../state/UserState";
import React, { Dispatch, useEffect, useRef } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { AppState } from "../state/AppState";
import { useDispatch, useSelector } from "react-redux";
import { AppController } from "../controller/AppController";
import { BaseAction } from "../actions/BaseActions";
import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { OperationStatus } from "../state/OperationState";
import { LoadingIcon } from "./LoadingIcon";
import { LoginPage } from "./LoginPage";

  
interface AppProps {
    userState: UserState,
}

export const App = () => {
    const dispatch: Dispatch<BaseAction> = useDispatch();
    const userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    const appController: AppController = useRef(new AppController(userDispatcher)).current;
    function mapStateToProps(state: AppState): AppProps {
        return {
            userState: state.userState,
        }
    }
    let {userState} = useSelector<AppState, AppProps>(mapStateToProps);

    useEffect(() => {
        console.log('new user state');
        appController.onUserStateChanged(userState);
    }, [userState, appController]);

    if (userState.operationState.status === OperationStatus.IN_PROGRESS) {
        return <LoadingIcon/>
    } else {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/login">
                        <LoginPage></LoginPage>
                    </Route>
                    <Route path="/sign-up"></Route>
                    <Route path="/">Hello</Route>
                </Switch>
            </HashRouter>
        );
    }
}

export default App;