import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { User } from "../model/UserModel"
import { AppState } from "../state/AppState";
import { ChatState } from "../state/ChatState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { ChatBar } from "./ChatBar";
import { FriendBar } from "./FriendBar";
import { SearchBar } from "./SearchBar";
import './SideBar.scss';

interface FriendBarProps {
    onUserSelected(user: User): void;
}

interface MapStateToProps {
    chatState: ChatState,
    fetchChatStatus: OperationStatus,
}

export const SideBar = ({onUserSelected}: FriendBarProps) => {
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
            <div className="search-bar-container">
                <SearchBar onTextChange={onSearchFriendNameChangeHandler}></SearchBar>
            </div>
            <div className="bar-container">
                {(() => {
                    if (showChat) {
                        return <ChatBar></ChatBar>
                    } else {
                        return <FriendBar onUserSelected={onUserSelected} searchName={searchName}></FriendBar>
                    }
                })()}
            </div>
        </div>
    )
}