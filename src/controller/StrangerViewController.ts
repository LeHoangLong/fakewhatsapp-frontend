import { IChatDispatcher } from "../dispatcher/IChatDispatcher";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { IInvitationDispatcher } from "../dispatcher/IInvitationDispatcher";
import { User } from "../model/UserModel";

export class StrangerViewController {
    constructor(
        public dispatcher: IInvitationDispatcher,
        public chatDispatcher: IChatDispatcher,
        public friendDispatcher: IFriendDispatcher,
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

    onAcceptPendingFriendRequest(selectdUser: User) { 
        this.dispatcher.acceptFriendRequestFromUser(selectdUser.infoId);
        this.chatDispatcher.setSelectedUser(selectdUser);
        this.friendDispatcher.addFriendIfNotYet(selectdUser);
    }

    onRejectPendingFriendRequest(senderInfoId: number) {
        this.dispatcher.rejectFriendRequestFromUser(senderInfoId);
    }
}