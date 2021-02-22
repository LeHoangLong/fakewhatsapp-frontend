import { Invitation } from "../model/InvitationModel";

export class IInvitationDispatcherErrorFriendRequestSentFromOtherUser {

}

export interface IInvitationDispatcher {
    fetchFriendRequestForUser(currentUserInfoId: number, userInfoId: number): Promise<void>;
    sendFriendRequestToUser(recipientInfoId: number): Promise<void>;
    deleteSentFriendRequestToUser(recipientInfoId: number): Promise<void>;
    rejectFriendRequestFromUser(senderInfoId: number): Promise<void>;
    acceptFriendRequestFromUser(senderInfoId: number): Promise<void>;
}