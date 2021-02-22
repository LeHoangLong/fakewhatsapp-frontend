import { IInvitationDispatcher } from "../dispatcher/IInvitationDispatcher";

export class StrangerViewController {
    constructor(
        public dispatcher: IInvitationDispatcher,
    ) {

    }

    onShown(currentUserInfoId: number, userInfoId: number) {
        this.dispatcher.fetchFriendRequestForUser(currentUserInfoId, userInfoId);
    }

    onCreateFriendRequest(recipientInfoId: number) {
        this.dispatcher.sendFriendRequestToUser(recipientInfoId);
    }

    onDeleteSentFriendRequest(recipientInfoId: number) {
        this.dispatcher.deleteSentFriendRequestToUser(recipientInfoId);
    }
}