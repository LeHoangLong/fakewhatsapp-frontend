import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StrangerViewController } from "../controller/StrangerViewController";
import { ChatDispatcher } from "../dispatcher/ChatDispatcher";
import { FriendDispatcher } from "../dispatcher/FriendDispatcher";
import { InvitationDispatcher } from "../dispatcher/InvitationDispatcher";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { InvitationState } from "../state/InvitationState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";
import { LoadingIcon } from "./LoadingIcon";
import './StrangerView.scss';

interface StrangerViewProps {
    selectedUser: User
    thisUser: User 
}

interface MapStateToProps {
    invitationState: InvitationState
    sendInvitationStatus: OperationStatus,
    fetchInvitationStatus: OperationStatus,
    deleteSentInvitationStatus: OperationStatus,
    acceptInvitationStatus: OperationStatus,
}

export const StrangerView = ({thisUser, selectedUser}: StrangerViewProps) => {
    let dispatch = useDispatch();
    let invitationDispatcher: InvitationDispatcher = useRef(new InvitationDispatcher(dispatch)).current;
    let chatDispatcher: ChatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let friendDispatcher: FriendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let strangerViewController: StrangerViewController = useRef(new StrangerViewController(invitationDispatcher, chatDispatcher, friendDispatcher)).current;
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        strangerViewController.onShown(thisUser.infoId, selectedUser.infoId);
    }, [selectedUser.infoId, thisUser.infoId, strangerViewController]);

    let {invitationState, sendInvitationStatus, 
        fetchInvitationStatus, deleteSentInvitationStatus,
        acceptInvitationStatus } = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        invitationState: state.invitationState,
        sendInvitationStatus: state.operationStatusState.SEND_INVITATION,
        fetchInvitationStatus: state.operationStatusState.FETCH_INVITATION,
        deleteSentInvitationStatus: state.operationStatusState.DELETE_INVITATION,
        acceptInvitationStatus: state.operationStatusState.ACCEPT_INVITATION,
    }));

    useEffect(() => {
        if (fetchInvitationStatus.status === EOperationStatus.IN_PROGRESS ||
            fetchInvitationStatus.status === EOperationStatus.INIT) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [fetchInvitationStatus]);

    function showButton() {
        if (invitationState.sentInvitations.has(selectedUser.infoId)) {
            let isLoading = deleteSentInvitationStatus.status === EOperationStatus.IN_PROGRESS;
            return (
                <button className="cancel-friend-request" onClick={() => strangerViewController.onDeleteSentFriendRequest(selectedUser.infoId)}>
                    Cancel friend request
                    <div style={{display: isLoading? 'block': 'none'}}>
                        <LoadingIcon sizePx={30}></LoadingIcon>
                    </div>
                </button>
            );
        } else if (invitationState.pendingInvitations.has(selectedUser.infoId)) {
            let isLoading = acceptInvitationStatus.status === EOperationStatus.IN_PROGRESS;
            return (
                <div className="accept-friend-request-buttons-container">
                    <button className="reject-button" onClick={() => strangerViewController.onRejectPendingFriendRequest(selectedUser.infoId)}>
                        Reject
                    </button>
                    <button className="accept-button" onClick={() => strangerViewController.onAcceptPendingFriendRequest(selectedUser)}>
                        Accept
                    </button>
                    <div style={{display: isLoading? 'block': 'none'}}>
                        <LoadingIcon sizePx={30}></LoadingIcon>
                    </div>
                </div>
            )
        } else {
            let isLoading = sendInvitationStatus.status === EOperationStatus.IN_PROGRESS;
            return (
                <button className="send-friend-request-button" disabled={isLoading} onClick={() => strangerViewController.onCreateFriendRequest(selectedUser.infoId)}>
                    Send friend request
                    <div style={{display: isLoading? 'block': 'none'}}>
                        <LoadingIcon sizePx={30}></LoadingIcon>
                    </div>
                </button>
            );
        }
    }

    if (isLoading) {
        return (
            <div className="stranger-view">
                <LoadingIcon></LoadingIcon>
            </div>
        );
    } else {
        return (
            <div className="stranger-view">
                <div className="profile-icon">
                    { selectedUser.name[0].toUpperCase() }
                </div>
                <div className="name">
                    { selectedUser.name }
                </div>
                { showButton() }
            </div>
        )
    }

}