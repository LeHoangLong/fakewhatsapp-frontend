import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../state/AppState';
import { UserState, UserStatus } from '../state/UserState';
import { LoginPage } from "./LoginPage";
import { MainPage } from "./MainPage";

interface AppProps {
    userState: UserState,
}

export const App = () => {
    let {userState} = useSelector<AppState, AppProps>((state: AppState): AppProps => {
        return {
            userState: state.userState
        };
    });

    if (userState.status === UserStatus.LOGGED_IN && userState.user !== undefined) {
        console.log('show main page');
        return <MainPage></MainPage>
    } else {
        console.log('show login page');
        return <LoginPage></LoginPage>
    }
}

export default App;