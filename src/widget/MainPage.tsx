import { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseAction } from "../actions/BaseActions";
import { MainPageController } from "../controller/MainPageController";
import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { UserState } from "../state/UserState";
import { FriendBar } from "./FriendBar";
import { LoadingIcon } from "./LoadingIcon";
import './MainPage.scss';
import { StrangerView } from "./StrangerView";

interface MainPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
    loginOperationStatus: OperationStatus,
    friendState: FriendState,
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
            friendState: state.friendState,
        }
    }
    let {userState, getUserInfoOperationStatus, loginOperationStatus, friendState} = useSelector<AppState, MainPageProps>(mapStateToProps);
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

    let [showUserInfo, setShowUserInfo] = useState(false);
    let [showConversation, setShowConversation] = useState(false);
    let [selectedUser, setSelectedUser] = useState<User | null>(null);
    function onUserSelected(user: User) {
        console.log(user);
        setSelectedUser(user);
    }

    useEffect(() => {
        if (selectedUser) {
            if (friendState.doesFriendWithInfoIdExists(selectedUser.infoId)) {
                setShowUserInfo(false);
                setShowConversation(true);
            } else {
                setShowUserInfo(true);
                setShowConversation(false);
            }
        } else {
            setShowUserInfo(false);
            setShowConversation(false);
        }
    }, [friendState, selectedUser]);

    function showUserInfoOrConversation() {
        if (showUserInfo) {
            if (selectedUser) {
                //this condition by right is always true
                return (
                    <StrangerView user={selectedUser}></StrangerView>
                )
            }
        } else if (showConversation){
            return (
                <div>
                    Conversation
                </div>
            )
        }
    }

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
                    <FriendBar onUserSelected={onUserSelected}></FriendBar>
                </div>
                <div className="main-pane">
                    { showUserInfoOrConversation() }
                </div>
            </div>
        )
    }
}