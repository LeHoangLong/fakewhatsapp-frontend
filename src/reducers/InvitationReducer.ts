import { BaseAction } from "../actions/BaseActions";
import { EInvitationActionTypes, InvitationActionAddPendingInvitation, InvitationActionAddSentInvitation } from "../actions/InvitationActions";
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
            console.log('addPendingInvitationAction.invitation');
            console.log(addPendingInvitationAction.invitation);
            return new InvitationState(
                state.sentInvitations,
                state.addPendingInvitation(addPendingInvitationAction.invitation),
            )

        default:
            return state;
    }
}