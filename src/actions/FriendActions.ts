import { User } from "../model/UserModel";
import { BaseAction } from "./BaseActions";

export const EFriendActionTypes = {
    ADD_FRIENDS: Symbol('ADD_FRIENDS'),
}

export class FriendActionAddFriends extends BaseAction {
    readonly newFriends: User[];
    constructor(newFriends: User[]) {
        super(EFriendActionTypes.ADD_FRIENDS);
        this.newFriends = newFriends;
    }
}
