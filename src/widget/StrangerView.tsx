import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StrangerViewController } from "../controller/StrangerViewController";
import { InvitationDispatcher } from "../dispatcher/InvitationDispatcher";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { InvitationState } from "../state/InvitationState";
import './StrangerView.scss';

interface StrangerViewProps {
    selectedUser: User
    thisUser: User 
}

interface MapStateToProps {
    invitationState: InvitationState
}

export const StrangerView = ({thisUser, selectedUser}: StrangerViewProps) => {
    let dispatch = useDispatch();
    let invitationDispatcher: InvitationDispatcher = useRef(new InvitationDispatcher(dispatch)).current;
    let strangerViewController: StrangerViewController = useRef(new StrangerViewController(invitationDispatcher)).current;

    useEffect(() => {
        strangerViewController.onShown(thisUser.infoId, selectedUser.infoId);
    }, []);

    let {invitationState} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        invitationState: state.invitationState
    }));

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
            return (
                <button className="send-friend-request-button">
                    Send friend request
                </button>
            )
        }
    }

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