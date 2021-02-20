import { User } from "../model/UserModel";
import { BaseAction } from "./BaseActions";

export const EFriendActionTypes = {
    ADD_FRIENDS: Symbol('ADD_FRIENDS'),
    SET_TOTAL_NUMBER_OF_FRIENDS: Symbol('SET_TOTAL_NUMBER_OF_FRIENDS'),
    SET_PAGE: Symbol('SET_PAGE'),
}

export class FriendActionAddFriends extends BaseAction {
    readonly newFriends: User[];
    constructor(newFriends: User[]) {
        super(EFriendActionTypes.ADD_FRIENDS);
        this.newFriends = newFriends;
    }
}

export class FriendActionSetTotalNumberOfFriends extends BaseAction {
    readonly numberOfFriends: number;
    constructor(numberOfFriends: number) {
        super(EFriendActionTypes.SET_TOTAL_NUMBER_OF_FRIENDS);
        this.numberOfFriends = numberOfFriends;
    }
}

export class FriendActionSetpage extends BaseAction {
    readonly offset: number;
    readonly pageSize: number;
    constructor(offset: number, pageSize: number) {
        super(EFriendActionTypes.SET_PAGE);
        this.offset = offset;
        this.pageSize = pageSize;
    }
}
