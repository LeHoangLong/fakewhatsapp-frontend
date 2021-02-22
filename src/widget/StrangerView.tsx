import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StrangerViewController } from "../controller/StrangerViewController";
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
}

export const StrangerView = ({thisUser, selectedUser}: StrangerViewProps) => {
    let dispatch = useDispatch();
    let invitationDispatcher: InvitationDispatcher = useRef(new InvitationDispatcher(dispatch)).current;
    let strangerViewController: StrangerViewController = useRef(new StrangerViewController(invitationDispatcher)).current;
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        strangerViewController.onShown(thisUser.infoId, selectedUser.infoId);
    }, [selectedUser.infoId, thisUser.infoId, strangerViewController]);

    let {invitationState, sendInvitationStatus, fetchInvitationStatus} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        invitationState: state.invitationState,
        sendInvitationStatus: state.operationStatusState.SEND_INVITATION,
        fetchInvitationStatus: state.operationStatusState.FETCH_INVITATION,
    }));

    useEffect(() => {
        if (fetchInvitationStatus.status === EOperationStatus.IN_PROGRESS) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [fetchInvitationStatus]);

    function showButton() {
        if (invitationState.sentInvitations.has(selectedUser.infoId)) {
            return (
                <button className="cancel-friend-request">
                    Cancel friend request
                </button>
            );
        } else if (invitationState.pendingInvitations.has(selectedUser.infoId)) {
            return (
                <div className="accept-friend-request-buttons-container">
                    <button className="reject-button">
                        Reject
                    </button>
                    <button className="accept-button">
                        Accept
                    </button>
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