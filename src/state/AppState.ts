import { FoundUserState } from "./FoundUserState";
import { FriendState } from "./FriendState";
import { InvitationState } from "./InvitationState";
import { OperationStatusState } from "./OperationStatusState";
import { UserState } from "./UserState";

export class AppState {
    constructor(
        public userState: UserState, 
        public operationStatusState: OperationStatusState, 
        public friendState: FriendState,
        public foundUserState: FoundUserState,
        public invitationState: InvitationState,
    ) {
    }
}