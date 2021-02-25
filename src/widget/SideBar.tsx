import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Chat } from "../model/ChatModel";
import { User } from "../model/UserModel"
import { AppState } from "../state/AppState";
import { ChatState } from "../state/ChatState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { ChatBar } from "./ChatBar";
import { FriendBar } from "./FriendBar";
import { ProfileBar } from "./ProfileBar";
import { SearchBar } from "./SearchBar";
import './SideBar.scss';

interface MapStateToProps {
    chatState: ChatState,
    fetchChatStatus: OperationStatus,
}

export const SideBar = () => {
    let [showChat, setShowChat] = useState(true);
    let [searchName, setSearchName] = useState('');
    function onSearchFriendNameChangeHandler(value: string) {
        setSearchName(value);
    }

    let {chatState, fetchChatStatus} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        chatState: state.chatState,
        fetchChatStatus: state.operationStatusState.FETCH_CHAT,
    }));

    useEffect(() => {
        if (searchName !== '' || (chatState.chats.length === 0 && chatState.isEndReached && fetchChatStatus.status === EOperationStatus.IDLE)) {
            setShowChat(false);
        } else {
            setShowChat(true);
        }
    }, [searchName, chatState, fetchChatStatus]);

    return (
        <div className="side-bar">
            <div className="profile-bar-container">
                <ProfileBar></ProfileBar>
            </div>
            <div className="search-bar-container">
                <SearchBar onTextChange={onSearchFriendNameChangeHandler}></SearchBar>
            </div>
            <div className="bar-container">
                {(() => {
                    if (showChat) {
                        return <ChatBar></ChatBar>
                    } else {
                        return <FriendBar searchName={searchName}></FriendBar>
                    }
                })()}
            </div>
        </div>
    )
}