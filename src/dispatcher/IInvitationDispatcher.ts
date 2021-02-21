import { Invitation } from "../model/InvitationModel";

export interface IInvitationDispatcher {
    fetchFriendRequestForUser(currentUserInfoId: number, userInfoId: number): Promise<void>;
}