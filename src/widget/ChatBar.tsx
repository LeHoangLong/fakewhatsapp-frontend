import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { ChatBarController } from "../controller/ChatBarController";
import { ChatDispatcher } from "../dispatcher/ChatDispatcher";
import { AppState } from "../state/AppState"
import { ChatState } from "../state/ChatState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState"
import { LoadingIcon } from "./LoadingIcon";

interface MapStateToProps {
    fetchChatStatus: OperationStatus,
    chatState: ChatState
}

export const ChatBar = () => {
    let {fetchChatStatus} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        fetchChatStatus: state.operationStatusState.FETCH_CHAT,
        chatState: state.chatState,
    }));
    let dispatch = useDispatch();
    let chatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let controller = useRef(new ChatBarController(chatDispatcher)).current;
    let [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        controller.onFetchChatOperationStatusChanged(fetchChatStatus);
    }, [controller, fetchChatStatus]);

    useEffect(() => {
        if (fetchChatStatus.status === EOperationStatus.IN_PROGRESS) {
            setisLoading(true);
        } else {
            setisLoading(false);
        }
    }, [fetchChatStatus]);

    function showChats() {
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
                Hello
                { showChats() }
            </div>
        )
    }
}