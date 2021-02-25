import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { ChatBarController } from "../controller/ChatBarController";
import { ChatDispatcher } from "../dispatcher/ChatDispatcher";
import { FoundUserDispatcher } from "../dispatcher/FoundUserDispatcher";
import { FriendDispatcher } from "../dispatcher/FriendDispatcher";
import { Chat } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState"
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState"
import { LoadingIcon } from "./LoadingIcon";
import './ChatBar.scss';

interface MapStateToProps {
    fetchChatStatus: OperationStatus,
    chatState: ChatState,
    friendState: FriendState,
    thisUser: User,
}

export const ChatBar = () => {
    let {fetchChatStatus, chatState, friendState, thisUser} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        fetchChatStatus: state.operationStatusState.FETCH_CHAT,
        chatState: state.chatState,
        friendState: state.friendState,
        thisUser: state.userState.user!,
    }));
    let dispatch = useDispatch();
    let chatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let friendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let foundUserDispatcher = useRef(new FoundUserDispatcher(dispatch)).current;
    let controller = useRef(new ChatBarController(chatDispatcher, friendDispatcher, foundUserDispatcher)).current;
    let [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        controller.onFetchChatOperationStatusChanged(thisUser, fetchChatStatus);
    }, [controller, thisUser, fetchChatStatus]);

    useEffect(() => {
        if (fetchChatStatus.status === EOperationStatus.IN_PROGRESS) {
            setisLoading(true);
        } else {
            setisLoading(false);
        }
    }, [fetchChatStatus]);

    useEffect(() => {
        controller.onChatStateChanges(thisUser, chatState, friendState);
    }, [controller, thisUser, chatState, friendState,]);

    function showChats() {
        let ret = [];
        for (let i = 0; i < chatState.chats.length; i++) {
            let chat: Chat = chatState.chats[i];
            let chatClassName = "chat-summary-container";
            if (chatState.selectedChatId === chat.id) {
                chatClassName = "chat-summary-container-selected";
            }
            let showGroupChatIcon: boolean = chat.isGroupChat;
            let otherUserInfoId: number = -1;
            for (let j = 0; j < chat.participantsId.length; j++) {
                if (chat.participantsId[j] !== thisUser.infoId) {
                    otherUserInfoId = chat.participantsId[j];
                    break;
                }
            }
            let chatTitle: string = chat.name;
            if (!chat.isGroupChat) {
                // if not group chat, the name will be empty and
                // we will need to use other user name instead
                // if we have them in our friend list
                if (friendState.doesFriendWithInfoIdExists(otherUserInfoId)) {
                    let user: User = friendState.findFriendByInfoId(otherUserInfoId);
                    chatTitle = user.name;
                }
            } else {
                chatTitle = chat.name;
            }
            ret.push(
                <div className={chatClassName} key={chat.id} onClick={() => controller.onChatSelected(chat)}>
                    <div className="icon-container">
                        {(() => {
                            if (showGroupChatIcon) {
                                return (<i className="fas fa-users"></i>);
                            } else {
                                if (friendState.doesFriendWithInfoIdExists(otherUserInfoId)){
                                    let friend = friendState.findFriendByInfoId(otherUserInfoId);
                                    return (
                                        <div className="profile-letter">
                                            { friend.name[0].toUpperCase() }
                                        </div>
                                    );
                                } else {
                                    return (
                                        <i className="fas fa-user"></i>
                                    );
                                }
                            }
                        })()}
                        
                    </div>
                    <div className="chat-summary">
                        <div className="chat-title">
                            { chatTitle }
                        </div>
                        <div className="latest-message-content">
                            { chat.latestMessageContent }
                        </div>
                    </div>
                </div>
            );
        }
        return ret;
    }

    if (isLoading) {
        return (
            <div className="chat-bar">
                <LoadingIcon sizePx={30}></LoadingIcon>
            </div>
        );
    } else {
        return (
            <div className="chat-bar">
                { showChats() }
            </div>
        )
    }
}