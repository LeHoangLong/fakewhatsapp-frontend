import { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BaseAction } from "../actions/BaseActions";
import { MainPageController } from "../controller/MainPageController";
import { UserDispatcher } from "../dispatcher/UserDispatcher";
import { Chat } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { UserState } from "../state/UserState";
import { ConversationView } from "./ConversationView";
import { LoadingIcon } from "./LoadingIcon";
import './MainPage.scss';
import { SideBar } from "./SideBar";
import { StrangerView } from "./StrangerView";

interface MainPageProps {
    userState: UserState,
    getUserInfoOperationStatus: OperationStatus,
    loginOperationStatus: OperationStatus,
    friendState: FriendState,
    chatState: ChatState
}

export const MainPage = () => {
    const dispatch: Dispatch<BaseAction> = useDispatch();
    const userDispatcher: UserDispatcher = useRef(new UserDispatcher(dispatch)).current;
    const mainPageController: MainPageController = useRef(new MainPageController(userDispatcher)).current;
    function mapStateToProps(state: AppState): MainPageProps {
        return {
            userState: state.userState,
            getUserInfoOperationStatus: state.operationStatusState.GET_USER_INFO,
            loginOperationStatus: state.operationStatusState.LOG_IN,
            friendState: state.friendState,
            chatState: state.chatState,
        }
    }
    let {userState, getUserInfoOperationStatus, loginOperationStatus, friendState, chatState} = useSelector<AppState, MainPageProps>(mapStateToProps);
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



    useEffect(() => {
        if (chatState.selectedChatId !== null) {
            setShowUserInfo(false);
            setShowConversation(true);
        } else if (chatState.selectedUser) {
            if (friendState.doesFriendWithInfoIdExists(chatState.selectedUser.infoId)) {
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
    }, [friendState, chatState.selectedUser, chatState.selectedChatId]);

    function showUserInfoOrConversation() {
        if (showUserInfo) {
            if (chatState.selectedUser) {
                //this condition by right is always true
                return (
                    <StrangerView selectedUser={chatState.selectedUser} thisUser={ userState.user! }></StrangerView>
                )
            }
        } else if (showConversation){
            return (
                <ConversationView></ConversationView>
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
                    <SideBar></SideBar>
                </div>
                <div className="main-pane">
                    { showUserInfoOrConversation() }
                </div>
            </div>
        )
    }
}