import { Invitation } from "../model/InvitationModel";

export class InvitationState {
    constructor(
        public sentInvitations: Map<number, Invitation>,
        public pendingInvitations: Map<number, Invitation>
    ) {

    }

    doesSentInvitationToUserInfoIdExists(userInfoId: number) {
        return userInfoId in this.sentInvitations;
    }
    
    doesPendingInvitationFromUserInfoIdExists(userInfoId: number) {
        return userInfoId in this.pendingInvitations;
    }

    addSentInvitation(invitation: Invitation): Map<number, Invitation> {
        let newMap = new Map(this.sentInvitations);
        newMap.set(invitation.recipientInfoId, invitation);
        return newMap;
    }

    addPendingInvitation(invitation: Invitation): Map<number, Invitation> {
        let newMap = new Map(this.pendingInvitations);
        newMap.set(invitation.senderInfoId, invitation);
        return newMap;
    }

    removeSentInvitation(recipientInfoId: number): Map<number, Invitation> {
        let newMap = new Map(this.sentInvitations);
        newMap.delete(recipientInfoId);
        return newMap;
    }
}