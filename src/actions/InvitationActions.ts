import { Invitation } from "../model/InvitationModel";
import { BaseAction } from "./BaseActions";

export const EInvitationActionTypes = {
    ADD_SENT_INVITATION: Symbol('ADD_SENT_INVITATION'),
    ADD_PENDING_INVITATION: Symbol('ADD_PENDING_INVITATION'),
    DELETE_SENT_INVITATION: Symbol('DELETE_SENT_INVITATION'),
    DELETE_PENDING_INVITATION: Symbol('DELETE_PENDING_INVITATION'),
    ACCEPT_PENDING_INVITATION: Symbol('ACCEPT_PENDING_INVITATION'),
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

export class InvitationActionDeleteSentInvitation extends BaseAction {
    constructor(
        public recipientInfoId: number
    ) {
        super(EInvitationActionTypes.DELETE_SENT_INVITATION);
    }
}

export class InvitationActionDeletePendingInvitation extends BaseAction {
    constructor(
        public senderInfoId: number
    ) {
        super(EInvitationActionTypes.DELETE_PENDING_INVITATION);
    }
}

export class InvitationActionAcceptPendingInvitation extends BaseAction {
    constructor(
        public senderInfoId: number
    ) {
        super(EInvitationActionTypes.ACCEPT_PENDING_INVITATION);
    }
}