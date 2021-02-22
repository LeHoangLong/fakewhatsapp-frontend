import { BaseAction } from "../actions/BaseActions";
import { EInvitationActionTypes, InvitationActionAcceptPendingInvitation, InvitationActionAddPendingInvitation, InvitationActionAddSentInvitation, InvitationActionDeletePendingInvitation, InvitationActionDeleteSentInvitation } from "../actions/InvitationActions";
import { Invitation } from "../model/InvitationModel";
import { InvitationState } from "../state/InvitationState";

export const initialInvitationState = new InvitationState(
    new Map<number, Invitation>(),
    new Map<number, Invitation>(),
);

export const invitationReducer = (state: InvitationState, action: BaseAction): InvitationState => {
    switch (action.type) {
        case EInvitationActionTypes.ADD_SENT_INVITATION:
            let addSentInvitationAction = action as InvitationActionAddSentInvitation;
            return new InvitationState(
                state.addSentInvitation(addSentInvitationAction.invitation),
                state.pendingInvitations,
            )
        case EInvitationActionTypes.ADD_PENDING_INVITATION:
            let addPendingInvitationAction = action as InvitationActionAddPendingInvitation;
            return new InvitationState(
                state.sentInvitations,
                state.addPendingInvitation(addPendingInvitationAction.invitation),
            )
        case EInvitationActionTypes.DELETE_SENT_INVITATION:
            let deleteSentInvitationAction = action as InvitationActionDeleteSentInvitation;
            return new InvitationState(
                state.removeSentInvitation(deleteSentInvitationAction.recipientInfoId),
                state.pendingInvitations,
            )
        case EInvitationActionTypes.DELETE_PENDING_INVITATION:
            let deletePendingInvitationAction = action as InvitationActionDeletePendingInvitation;
            return new InvitationState(
                state.sentInvitations,
                state.removeSentInvitation(deletePendingInvitationAction.senderInfoId),
            )
        case EInvitationActionTypes.ACCEPT_PENDING_INVITATION:
            let acceptPendingInvitationAction = action as InvitationActionAcceptPendingInvitation;
            return new InvitationState(
                state.sentInvitations,
                state.removeSentInvitation(acceptPendingInvitationAction.senderInfoId),
            )
        default:
            return state;
    }
}