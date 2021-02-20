import { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseAction } from "../actions/BaseActions";
import { MainPageController } from "../controller/MainPageController";
import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { AppState } from "../state/AppState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { UserState } from "../state/UserState";
import { FriendBar } from "./FriendBar";
import { LoadingIcon } from "./LoadingIcon";
import './MainPage.scss';

interface MainPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
    loginOperationStatus: OperationStatus,
}

export const MainPage = () => {
    const dispatch: Dispatch<BaseAction> = useDispatch();
    const userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    const mainPageController: MainPageController = useRef(new MainPageController(userDispatcher)).current;
    function mapStateToProps(state: AppState): MainPageProps {
        return {
            userState: state.userState,
            getUserInfoOperationStatus: state.operationStatusState.getUserInfoStatus,
            loginOperationStatus: state.operationStatusState.loginStatus,
        }
    }
    let {userState, getUserInfoOperationStatus, loginOperationStatus} = useSelector<AppState, MainPageProps>(mapStateToProps);
    let [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        mainPageController.onUserStateChanged(userState);
    }, [userState, mainPageController]);

    useEffect(() => {
        if (getUserInfoOperationStatus.status === EOperationStatus.INIT || //init status here because on start up, we want to fetch data first before showing anything
            getUserInfoOperationStatus.status === EOperationStatus.IN_PROGRESS ||
            loginOperationStatus.status === EOperationStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [getUserInfoOperationStatus, loginOperationStatus])

    if (isLoading) {
        return (
            <div className="main-page">
                <LoadingIcon></LoadingIcon>
            </div>
        );
    } else {
        return (
            <div className="main-page">
                <div className="friend-bar-container">
                    <FriendBar></FriendBar>
                </div>
            </div>
        )
    }
}