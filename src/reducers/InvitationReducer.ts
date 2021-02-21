import { stat } from "fs";
import { BaseAction } from "../actions/BaseActions";
import { EInvitationActionTypes, InvitationActionAddSentInvitation } from "../actions/InvitationActions";
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
        default:
            return state;
    }
}