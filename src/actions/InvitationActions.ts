import { Invitation } from "../model/InvitationModel";
import { BaseAction } from "./BaseActions";

export const EInvitationActionTypes = {
    ADD_SENT_INVITATION: Symbol('ADD_SENT_INVITATION'),
    ADD_PENDING_INVITATION: Symbol('ADD_PENDING_INVITATION'),
}

export class InvitationActionAddSentInvitation extends BaseAction {
    constructor(
        public invitation: Invitation
    ) {
        super(EInvitationActionTypes.ADD_SENT_INVITATION);
    }
}

export class InvitationActionAddPendingInvitation extends BaseAction {
    constructor(
        public invitation: Invitation
    ) {
        super(EInvitationActionTypes.ADD_PENDING_INVITATION);
    }
}